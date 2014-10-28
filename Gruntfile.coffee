module.exports = (grunt)->
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-karma')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-coffeelint')
  grunt.loadNpmTasks('grunt-bumpx')

  grunt.initConfig(
    pkg:
      grunt.file.readJSON('package.json')
    clean:
      dist: [
        'dist'
        'src/public'
      ]
    bump:
      options:
        part: 'patch'
      files: [ 'package.json', 'bower.json']
    copy:
      dist:
        files: [
          {
            cwd: 'src/public'
            src: '**'
            dest: 'dist/public'
            expand: true
          }
        ]
      root:
        files: [
          cwd: 'src/html'
          src: [
            '**/*.html'
          ]
          dest: 'src/public'
          filter: 'isFile'
          expand: true
        ]
      bootstrap:
        files: [
          cwd: 'bower_components/bootstrap/dist'
          src: [
            'css/*.min.css'
            'css/*.map'
            'fonts/*'
            'js/*.min.js'
            'js/*.map'
          ]
          dest: 'src/public'
          expand: true
        ]
      angular:
        files: [
          cwd: 'bower_components/angular/'
          src: [
            'angular.js'
            'angular.min.js'
            'angular.min.js.map'
          ]
          dest: 'src/public/js'
          expand: true
          filter: 'isFile'
        ]
      angularI18n:
        files: [
          cwd: 'bower_components/angular-i18n/'
          src: [
            'angular-locale_zh-cn.js'
          ]
          dest: 'src/public/js'
          expand: true
          filter: 'isFile'
        ]
      angular_route:
        files: [
          cwd: 'bower_components/angular-route/'
          src: [
            'angular-route.js'
            'angular-route.min.js'
            'angular-route.min.js.map'
          ]
          dest: 'src/public/js'
          expand: true
          filter: 'isFile'
        ]
      ng_table_js:
        files: [
          cwd: 'bower_components/ng-table/'
          src: [
            'ng-table.js'
            'ng-table.min.js'
            'ng-table.map'
          ]
          dest: 'src/public/js'
          expand: true
          filter: 'isFile'
        ]
      ng_table_css:
        files: [
          cwd: 'bower_components/ng-table/'
          src: [
            'ng-table.min.css'
          ]
          dest: 'src/public/css'
          expand: true
          filter: 'isFile'
        ]
      storage:
        files: [
          cwd: 'bower_components/angular-local-storage/'
          src: [
            'angular-local-storage.min.js'
          ]
          dest: 'src/public/js'
          expand: true
          filter: 'isFile'
        ]
      md5:
        files: [
          cwd: 'bower_components/blueimp-md5/js'
          src: [
            'md5.min.js'
          ]
          dest: 'src/public/js'
          expand: true
          filter: 'isFile'
        ]
      jquery:
        files: [
          cwd: 'bower_components/jquery/dist'
          src: [
            'jquery.min.js'
            'jquery.min.map'
          ]
          dest: 'src/public/js'
          expand: true
          filter: 'isFile'
        ]
      upload:
        files: [
          cwd: 'bower_components/ng-file-upload'
          src: [
            'angular-file-upload-html5-shim.min.js'
            'angular-file-upload.min.js'
          ]
          dest: 'src/public/js'
          expand: true
          filter: 'isFile'
        ]
      hotkey:
        files: [
          cwd: 'bower_components/ng-hotkey'
          src: [
            'hotkey.min.js'
          ]
          dest: 'src/public/js'
          expand: true
          filter: 'isFile'
        ]
      socket:
        files: [
          cwd: 'bower_components/ngSocket/dist'
          src: [
            'ngSocket.js'
          ]
          dest: 'src/public/js'
          expand: true
          filter: 'isFile'
        ]
      ui:
        files: [
          cwd: 'bower_components/angular-bootstrap'
          src: [
            'ui-bootstrap-tpls.min.js'
          ]
          dest: 'src/public/js'
          expand: true
          filter: 'isFile'
        ]
      fontCss:
        files: [
          cwd: 'bower_components/font-awesome/css'
          src: [
            'font-awesome.min.css'
          ]
          dest: 'src/public/css'
          expand: true
          filter: 'isFile'
        ]
      font:
        files: [
          cwd: 'bower_components/font-awesome/fonts'
          src: [
            '*'
          ]
          dest: 'src/public/fonts'
          expand: true
          filter: 'isFile'
        ]
      text:
        files: [
          cwd: 'bower_components/textAngular/dist'
          src: [
            'textAngular-sanitize.min.js'
            'textAngular.min.js'
          ]
          dest: 'src/public/js'
          expand: true
          filter: 'isFile'
        ]
      css:
        files: [
          cwd: 'src/css'
          src: [
            '*.css'
          ]
          dest: 'src/public/css'
          expand: true
          filter: 'isFile'
        ]
    coffee:
      options:
        bare: true
      main:
        files:
          'src/public/js/web.min.js': [
            'src/js/web.coffee'
            'src/js/login.coffee'
          ]
          'src/public/js/app.min.js': [
            'src/js/app.coffee'
          ]
    uglify:
      main:
        files:
          'dist/js/web.min.js': [
            'src/public/js/web.min.js'
          ]
          'dist/js/app.min.js': [
            'src/public/js/app.min.js'
          ]
    cssmin:
      toolbox:
        expand: true
        cwd: 'src/public/css/'
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/'
        #ext: '.min.css'
    watch:
      css:
        files: [
          'src/css/*.css'
        ]
        tasks: ['copy:css']
      html:
        files: [
          'src/**/*.html'
        ]
        tasks: ['copy:root']
      coffee:
        files: [
          'src/**/*.coffee'
        ]
        tasks: ['coffee']
    karma:
      options:
        configFile: 'karma.conf.js'
      dev:
        colors: true,
      travis:
        singleRun: true
        autoWatch: false
  )
  grunt.registerTask('test', ['karma'])
  grunt.registerTask('dev', [
    'clean'
    'copy'
    'coffee'
  ])
  grunt.registerTask('dist', [
    'dev'
    'copy:dist'
    'uglify'
  ])
  grunt.registerTask('deploy', [
    'bump'
    'dist'
  ])
  grunt.registerTask('travis', 'travis test', ['karma:travis'])
  grunt.registerTask('default', ['dist'])
