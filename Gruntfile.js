module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        uglify: {
            options: {
                preserveComments: 'some'
            },
            remodal: {
                files: {
                    'dist/jquery.remodal.min.js': ['src/jquery.remodal.js']
                }
            }
        },

        copy: {
            remodal: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['jquery.remodal.css', 'jquery.remodal.js'],
                        dest: 'dist/'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'copy']);
};