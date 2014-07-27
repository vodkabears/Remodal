module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
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

        uglify: {
            options: {
                preserveComments: "some"
            },
            remodal: {
                files: {
                    "dist/jquery.remodal.min.js": ["src/jquery.remodal.js"]
                }
            }
        },

        copy: {
            remodal: {
                files: [
                    {
                        expand: true,
                        cwd: "src/",
                        src: ["jquery.remodal.css", "jquery.remodal.js"],
                        dest: "dist/"
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");

    // Default task(s).
    grunt.registerTask("test", ["jshint"]);
    grunt.registerTask("default", ["jshint", "uglify", "copy"]);
};