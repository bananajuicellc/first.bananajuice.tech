module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine: {
      test: {
        src: 'src/*.js',
        options: {
          specs: 'specs/*.spec.js',
          vendor: [
            'bower_components/director/build/director.min.js'
          ]
        }
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  
	grunt.registerTask('default', 'jasmine');
};