module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Import package manifest
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner: '/*\n' +
        ' *  <%= pkg.name[0].toUpperCase() + pkg.name.slice(1) %> - v<%= pkg.version %>\n' +
        ' *  <%= pkg.description %>\n' +
        ' *  <%= pkg.homepage %>\n' +
        ' *\n' +
        ' *  Made by <%= pkg.author.name %>\n' +
        ' *  Under <%= pkg.license %> License\n' +
        ' */\n'
    },

    connect: {
      server: {
        options: {
          port: 7770
        }
      }
    },

    jshint: {
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: 'src/**/*.js'
      },
      test: {
        src: 'test/**/*.js'
      },
      options: {
        jshintrc: '.jshintrc'
      }
    },

    jscs: {
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: 'src/**/*.js'
      },
      test: {
        src: 'test/**/*.js'
      }
    },

    csscomb: {
      all: {
        files: {
          'src/jquery.remodal.css': 'src/jquery.remodal.css'
        }
      }
    },

    qunit: {
      all: {
        options: {
          urls: [
            'jquery/dist/jquery.js',
            'jquery2/dist/jquery.js',
            'zepto/zepto.js'
          ].map(function(library) {
            return 'http://localhost:' +
              '<%= connect.server.options.port %>' +
              '/test/remodal.html?lib=' + library;
          })
        }
      }
    },

    concat: {
      dist: {
        files: {
          'dist/jquery.remodal.js': 'src/jquery.remodal.js',
          'dist/jquery.remodal.css': 'src/jquery.remodal.css'
        },
        options: {
          banner: '<%= meta.banner %>'
        }
      }
    },

    uglify: {
      remodal: {
        files: {
          'dist/jquery.remodal.min.js': 'src/jquery.remodal.js'
        }
      },
      options: {
        banner: '<%= meta.banner %>'
      }
    },

    githooks: {
      all: {
        'pre-commit': 'lint'
      },
      options: {
        command: 'node_modules/.bin/grunt'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-csscomb');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-jscs');

  // Tasks.
  grunt.registerTask('lint', ['jshint', 'jscs']);
  grunt.registerTask('test', ['connect', 'lint', 'qunit']);
  grunt.registerTask('default', [
    'connect', 'csscomb', 'jshint', 'jscs', 'qunit', 'concat', 'uglify', 'githooks'
  ]);
};
