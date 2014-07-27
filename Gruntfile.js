module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Import package manifest
        pkg: grunt.file.readJSON("remodal.jquery.json"),

        // Banner definitions
        meta: {
            banner: "/*\n" +
                " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
                " *  <%= pkg.description %>\n" +
                " *  <%= pkg.homepage %>\n" +
                " *\n" +
                " *  Made by <%= pkg.author.name %>\n" +
                " *  Under <%= pkg.licenses[0].type %> License\n" +
                " */\n"
        },

        // Lint definitions
        jshint: {
            gruntfile: {
                src: "Gruntfile.js"
            },
            src: {
                src: ["src/**/*.js"]
            },
            options: {
                jshintrc: ".jshintrc"
            }
        },

        // Concat definitions
        concat: {
            dist: {
                files: {
                    "dist/jquery.remodal.js": ["src/jquery.remodal.js"],
                    "dist/jquery.remodal.css": ["src/jquery.remodal.css"]
                },
                options: {
                    banner: "<%= meta.banner %>"
                }
            }
        },

        // Minify definitions
        uglify: {
            remodal: {
                files: {
                    "dist/jquery.remodal.min.js": ["src/jquery.remodal.js"]
                }
            },
            options: {
                banner: "<%= meta.banner %>"
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    // Default task(s).
    grunt.registerTask("test", ["jshint"]);
    grunt.registerTask("default", ["jshint", "concat", "uglify"]);
};