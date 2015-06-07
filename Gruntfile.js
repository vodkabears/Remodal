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
        ' */\n\n'
    },

    autoprefixer: {
      dist: {
        src: 'dist/**/*.css'
      },
      options: {
        browsers: ['> 0.1%'],
        cascade: false
      }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: ['dist/**/*', 'examples/**/*']
        },
        options: {
          watchTask: true,
          server: './'
        }
      }
    },

    concat: {
      dist: {
        files: {
          'dist/remodal.js': 'src/remodal.js',
          'dist/remodal.css': 'src/remodal.css',
          'dist/remodal-default-theme.css': 'src/remodal-default-theme.css'
        },
        options: {
          banner: '<%= meta.banner %>'
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 7770
        }
      }
    },

    csscomb: {
      all: {
        files: {
          'src/remodal.css': 'src/remodal.css',
          'src/remodal-default-theme.css': 'src/remodal-default-theme.css',
          'dist/remodal.css': 'dist/remodal.css',
          'dist/remodal-default-theme.css': 'dist/remodal-default-theme.css'
        }
      }
    },

    githooks: {
      all: {
        'pre-commit': 'lint'
      },
      options: {
        command: 'node_modules/.bin/grunt'
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
        src: ['test/**/*.js', 'libs/jquery-loader.js']
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
        src: ['test/**/*.js', 'libs/jquery-loader.js']
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

    uglify: {
      remodal: {
        files: {
          'dist/remodal.min.js': 'src/remodal.js'
        }
      },
      options: {
        banner: '<%= meta.banner %>'
      }
    },

    watch: {
      src: {
        files: ['src/**/*', 'examples/**/*'],
        tasks: ['build']
      },
      options: {
        spawn: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-csscomb');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-jscs');

  // Tasks
  grunt.registerTask('lint', ['jshint', 'jscs']);
  grunt.registerTask('test', ['connect', 'lint', 'qunit']);
  grunt.registerTask('build', ['concat', 'autoprefixer', 'csscomb', 'uglify', 'githooks']);
  grunt.registerTask('bsync', ['browserSync', 'watch']);
  grunt.registerTask('default', ['test', 'build']);
};
