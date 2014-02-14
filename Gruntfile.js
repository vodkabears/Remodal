module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        uglify: {
            options: {
                preserveComments: 'some'
            },
            remodal: {
                files: {
                    'build/jquery.remodal.min.js': ['src/jquery.remodal.js']
                }
            }
        },

        copy: {
            remodal: {
                src: 'src/jquery.remodal.css',
                dest: 'build/jquery.remodal.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'copy']);
};