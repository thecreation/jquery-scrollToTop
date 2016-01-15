'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        // -- clean config ----------------------------------------------------------
        clean: {
            files: ['dist']
        },
        // -- concat config ----------------------------------------------------------
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['src/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>.js'
            },
        },
        // -- uglify config ----------------------------------------------------------
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            },
        },
        babel: {
            options: {
                sourceMap: false,
                presets: ["es2015"],
                plugins: ["transform-es2015-modules-umd","external-helpers-2"]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.js'],
                    dest: 'dist/'
                }]
            }
        },
        // -- jshint config ----------------------------------------------------------
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            src: {
                options: {
                    jshintrc: 'src/.jshintrc'
                },
                src: ['src/**/*.js']
            },
        },
        // -- copy config ----------------------------------------------------------
        copy: {
            easing: {
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: 'bower_components/easing',
                    src: [
                        'css/easing.css'
                    ],
                    dest: 'css/'
                }]
            },
            jquery: {
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: 'bower_components/jquery',
                    src: [
                        'jquery.js',
                        'jquery.min.js'
                    ],
                    dest: 'demo/js'
                }]
            }
        },

        // -- less config ----------------------------------------------------------
        less: {
            dist: {
                files: {
                    'css/scrollToTop.css': ['less/scrollToTop.less']
                }
            }
        },

        // -- autoprefixer config ----------------------------------------------------------
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9', 'android 2.3', 'android 4', 'opera 12']
            },
            src: {
                expand: true,
                cwd: 'css/',
                src: ['scrollToTop.css'],
                dest: 'css/'
            }
        },
        // -- replace config ----------------------------------------------------------
        replace: {
            bower: {
                src: ['bower.json'],
                overwrite: true, // overwrite matched source files
                replacements: [{
                    from: /("version": ")([0-9\.]+)(")/g,
                    to: "$1<%= pkg.version %>$3"
                }]
            },
            jquery: {
                src: ['scrollToTop.jquery.json'],
                overwrite: true, // overwrite matched source files
                replacements: [{
                    from: /("version": ")([0-9\.]+)(")/g,
                    to: "$1<%= pkg.version %>$3"
                }]
            },
        },
        // -- jsbeautifier config ----------------------------------------------------------
        jsbeautifier: {
            files: ["src/**/*.js", 'Gruntfile.js'],
            options: {
                indent_size: 1,
                indent_char: "	",
                indent_level: 0,
                indent_with_tabs: true,
                preserve_newlines: true,
                max_preserve_newlines: 10,
                jslint_happy: false,
                brace_style: "collapse",
                keep_array_indentation: false,
                keep_function_indentation: false,
                space_before_conditional: true,
                break_chained_methods: false,
                eval_code: false,
                wrap_line_length: 0,
                unescape_strings: false
            }
        },
        // -- watch config ----------------------------------------------------------
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
        },
    });

    // Load npm plugins to provide necessary tasks.
    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*']
    });

    // Default task.
    grunt.registerTask('default', ['js', 'dist']);

    grunt.registerTask('dist', ['clean', 'concat', 'uglify']);
    grunt.registerTask('js', ['jsbeautifier', 'jshint']);
    grunt.registerTask('css', ['less', 'autoprefixer']);

    grunt.registerTask('version', [
        'replace:bower',
        'replace:jquery'
    ]);
};
