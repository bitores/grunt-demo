module.exports = function(grunt){
	/*
		在Grunt工具箱中，按任务目标我们可以分为：

		 编译文档型：比如编译LESS、Sass、Stylus、Coffeescript等；
		 文件操作型：比如说合并、压缩JavaScript、CSS、图片等；
		 质量保障型：比如JSHint、Jasmin、Mocha等；
		 类库构建型：比如说Backbone.js、ember.js、angular.js等。



		————————已完成基本
		css js语法检查、less编译、图片/html拷贝、html/css/js压缩
		特性化定制：
		需要自己去完成：比如路径相关、变量相关、插件配置相关
	*/


	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
              '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
              '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
              '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
              ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

		clean:{
			all:['build/**/*'],
			js:'build/js/**/*',
			images:'build/images/**/*',
			css:'build/css/**/*',
			html:'build/html/**/*'
		},

		jshint: {
			options:{
				// json   "key":value
				// 方法一：可以引入文件
				jshintrc: '.jshintrc'
				// 方法二：也可以在此处进行配置
			},
			build:['Gruntfile.js','src/*.js']
		},
		csslint:{
			options:{
				csslintrc: '.csslintrc'
			},
			build:['src/*.css']
		},


		less:{
			// 开发环境配置
			development:{
				options:{
					compress:true,
					yuicompress:true
				},
				files:{
					'build/css/ab.css':'src/less/ab.less',
					'build/css/ac.css':'src/less/ac.less'
				}
			},
			// 生产环境配置
			production:{
				options:{
					compress: true,
					yuicompress: true,
					optimization: 2
				},
				files:{
					'build/css/ab.css':'src/less/ab.less',
					'build/css/ac.css':'src/less/ac.less'
				}
			}
			
		},
				// 配置 uglify 插件的配置信息
		uglify: {
			options:{
				banner: '/*!<%= grunt.template.today("yyyy-mm-dd")%>*/\n'
			},
			builda:{//任务一：压缩a.js，不混淆变量名，保留注释，添加banner和footer
				options: {
                    mangle: false, //不混淆变量名
                    preserveComments: 'all', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                    footer:'\n/*! <%= pkg.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */'//添加footer
                },
                files:{
                	"build/js/<%=pkg.name%>-<%=pkg.version%>.min.js":"src/test.js"
                }
			},
			buildb:{//任务二：压缩b.js，输出压缩信息
				options: {
                    report: "min",//输出压缩率，可选的值有 false(不输出信息)，gzip
                    mangle:{
                    	except: ['require', 'exports', 'module', 'window']
                    }
                },
                ta:{
                	src:"src/test.js",
                	dest:"build/js/<%=pkg.name%>-<%=pkg.version%>.min.js"
                }
			}

		},

		bower: {
		    install: {
		        options: {
		        //文件按照模块分成单个目录(byComponent)
		        //想把所有的js放在同一个目录，所有的css文件放在同一个目录，则使用 byType
		            targetDir: 'build/js/lib',
		            layout: 'byComponent',
		            install: true,
		            verbose: false,
		            cleanTargetDir: false,
		            cleanBowerDir: false,
		            bowerOptions: {}
		        }
		    }
		},

		copy:{
			html:{
				files:{
					'build/html':'src/**/*.html'
				}
			},
			images:{
				files: [
          			{
          				expand: true, 
          				cwd: 'src', 
          				src: ['images/*.{png,jpg,jpeg,gif}'], 
          				dest: 'build'
          			}
         		]
			}
			
		},

		htmlmin:{
			options: {
				removeComments: true,
				removeCommentsFromCDATA: true,
				collapseWhitespace: true,
				collapseBooleanAttributes: true,
				removeAttributeQuotes: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeOptionalTags: true
			},
			html:{
				files:[
					{expand: true, cwd: 'src', src: ['*.html'], dest: 'build/html'},
					{expand: true, cwd: 'src/html', src: ['*.html'], dest: 'build/html'}
				]
			}
		},

		connect: {
	      server: {
	        options: {
	          hostname: 'm.bijia.kuaiqiangche.dev',
	          port: 6000,
	          //声明给 watch 监听的端口
               livereload: 35729,
	           open : {
                    //自动打开网页 http://localhost:8888
                    target : "http://m.bijia.kuaiqiangche.dev:6000"
                }
	        }
	      }
	    },

		watch:{
			 livereload : {
                //监听前面声明的端口  35729
                options : {
                    livereload : 35729
                    //reload : true
                },
                //下面文件的改变就会实时刷新网页
                files : [
                    "./myApp/*"
                ]
            },
			build:{
				files:['src/*.js','src/*.css'],
				tasks:['jshint','csslint','uglify'],
				options:{
					spawn: false
				}
			}
		}
	});

	
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');


	grunt.registerTask('default',['clean','jshint','uglify:builda','csslint','less:development','bower','copy','connect:server']);

	grunt.registerTask('production',['clean','jshint','uglify:buildb','csslint','less:production','bower','htmlmin',"copy:images"]);
	grunt.registerTask('watch',['watch']);
};