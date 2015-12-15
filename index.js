
//SIZE STUFF
		//.bar height & .boxstructure_wrapper width
		function barheight(){
			//.bar height
			$(".bar").each( 
				function( i ){
					var boxesheight = $(this).next(".boxes").innerHeight();
					$(this).height( boxesheight - 6 );
					// $(this).ellipsis( options={ellipsis:""} );
				}
			);
		};
		function boxstructurewrapperwidth(){
			//.boxstructure_wrapper width
			$(".boxstructure_wrapper").each(
				function( i ){
					var newwidth = 0;
					$(this).find(".boxstructure .bar, .boxstructure .boxes").each(
						function( i ){
							newwidth += $(this).outerWidth(true);
						}
					);
					$(this).width( newwidth );
				}
			);
		};
		//together
		function barheightboxstructurewrapperwidth(){
			barheight();
			boxstructurewrapperwidth();
		};


//BACKBONE STUFF
		var BoxModel = Backbone.Model.extend({
			//defaults
			defaults:{
				"clicked":false
			}
			//validate
			//initialize
		});
		var BoxModel_View = Backbone.View.extend({
			//el OR tagName,className,id
			tagName:"div",
			className: function(){
				return "box box-"+this.model.get("boxtype")+" small"
			},
			//render
			render: function(){
				this.$el.html( this.model.get("content_small")||$( "#"+this.model.get("content_id") ).html() );
				return this;
			},
			//initialize
			//events
			events:{
				"mouseover":"mouseover_box",
				"mouseout" :"mouseout_box",
				"click":"click_box"
			},
			mouseover_box: function( e ){
					//change color
					$(e.currentTarget).removeClass( "small" );
			},
			mouseout_box: function( e ){
				if( !this.model.get("clicked") ){
					//change color
					$(e.currentTarget).addClass( "small" );
				}
			},
			click_box: function( e ){
				this.model.set( { "clicked":!this.model.get("clicked") } );
				if( this.model.get("clicked") ){
					//enlarge
					var boxwidth = this.model.get("boxwidth")||600;
					//.boxstructure_wrapper width
					var temp = $(e.currentTarget).closest( ".boxstructure_wrapper" );
					temp.width( temp.width() + boxwidth - 180 );
					$(e.currentTarget).stop().animate( { width:boxwidth },100,
						//.bar height
						barheight
					);
					//load content
					var boxcontent = $( "#"+this.model.get("content_id") ).html();
					$(e.currentTarget).html( boxcontent );
				}
				else{
					//hide content
					$(e.currentTarget).html( this.model.get("content_small") );
					//shrink
					$(e.currentTarget).stop().animate( { width:180 },100,
						//.bar height & .boxstructure_wrapper width
						barheightboxstructurewrapperwidth
					);

					//change color
					$(e.currentTarget).addClass( "small" );
					//scroll up
					var temp1 = $(e.currentTarget).offset().top;
					var temp2 = temp1 - $(window).scrollTop();
					if( (temp2 < 0) || ($(window).height() < temp2) ){
						$(window).scrollTop( temp1 - 10 );
					}
				}
			}
		});
		var BoxModelCollection = Backbone.Collection.extend({
			//model
			model:BoxModel,
			//url
			//initialize
		});
		var BoxModelCollection_View = Backbone.View.extend({
			//el OR tagName,className,id
			//render
			render: function(){
				this.collection.each( this.addBox,this );
				// console.log(this.collection.bar_name);
				return this;
			},
			addBox: function( box ){
				var temp = new BoxModel_View( { model:box } );
				this.$el.append( temp.render().el );
			},
			//initialize
			// initialize: function() {
			// 	this.$el = $('.boxes');
			// },
			//events
			events:{
				"click":"click_box_coll"
			},
			click_box_coll: function( e ){
				var temp = $(e.currentTarget).children(".box");
				//if there are only "small" boxes
				if( !temp.not(".small").size() ){
					//animate box widths to width:180px
					temp.stop().animate( { width:180 },100,
						//.bar height & .boxstructure_wrapper width
						barheightboxstructurewrapperwidth
					);
				}
				//else
				else{
					//maxboxwidth: largest not ".small" box's *natural* boxwidth in the collection
					var maxboxwidth = 600;
					var temp1;
					for( var i = 0; i < this.collection.models.length; i++ ){
						if( temp1 = this.collection.models[i].get("boxwidth") ){ //has a natural boxwidth?
							if( this.collection.models[i].get("clicked") ){ //not ".small"?
								maxboxwidth = Math.max( maxboxwidth,temp1 );

							}
						}
					}
					//animate box widths to width:maxboxwidth
					temp.stop().animate( { width:maxboxwidth },20,
						//.bar height & .boxstructure_wrapper width
						barheightboxstructurewrapperwidth
					);
				}
			}
		});

		// var BoxRouter = Backbone.Router.extend({
		// 	//routes
		// 	routes :{
		// 		"":"aboutlink",
		// 		"project/:ttype/:tkey":"projectlink"
		// 	},
		// 	aboutlink: function() {
		// 		$('#contentarea').load( 'about.html' );
		// 	},
		// 	projectlink: function(ttype,tkey) {
		// 		$('#contentarea').load( 'projects/'+ttype+'_'+tkey+'/index.html' );
		// 	}
		// });

		// //BoxRouter
		// var box_router = new BoxRouter();
		// Backbone.history.start();


//CONTENT STUFF
		function boxfiller( screenname,avengers ){
			$.each( avengers,function( i,av ){
				if( $.type( av ) === "string" ){
					var hiddles = av;
					var hemsarray = [ null ];
					var atwell = '<div class="boxstructure" id="'+hiddles+'"> <div class="bar"></div><div class="boxes"><div class="boxcolumn"></div></div></div>';
				}
				else{
					var hiddles = av[0];
					var hemsarray = av[1];
					var atwell = '<div class="boxstructure" id="'+hiddles+'"><div class="bar"></div><div class="boxes">';
					$.each( hemsarray,function( i,hems ){
						atwell += '<div class="boxcolumn" id="'+hems+'"></div>';
					} );
					atwell += '</div></div>';
				}
				// atwell looks like
				// '<div class="boxstructure" id="'+hiddles+'">'
				// + 	'<div class="bar">'
				// + 	'</div>'
				// + 	'<div class="boxes">'
				// + 		'<div class="boxcolumn">'
				// + 		'</div>'
				// + 	'</div>'
				// + '</div>'

				//make em
				$( "#screen_"+screenname+" .boxstructure_wrapper" ).append( atwell );

				//fill em
				$.each( hemsarray,function( i,hems ){
					var hemshash       = ( hems )? ( "#"+hems ):( "" );
					var hemsunderscore = ( hems )? ( "_"+hems ):( "" );
					var temp = new BoxModelCollection_View( { collection:new BoxModelCollection( window["boxes_"+hiddles+hemsunderscore+"_arra"] ) } );
					$( "#screen_"+screenname+" .boxstructure#"+hiddles+" .boxcolumn"+hemshash ).html( temp.render().el );
				} );
			} );
			barheightboxstructurewrapperwidth();
		};


//STUFF STUFF
		$( window ).on( 'load',function(e){
			//fill up #screenarea
			// $('#screenarea').load( 'screen_ProbStat.html',barheightboxstructurewrapperwidth );
			barheightboxstructurewrapperwidth();


			//heights & positions
			var menuarea = $('#menuarea');
			var screenarea = $('#screenarea');

			function screenarearesizer() {
				// screenarea.width(  $(window).width()-346 );
				screenarea.height( $(window).height()-20 );
				// menuarea.height( $(window).height() );
				// screenarea.css( { 'left':menuarea.position().left+346 } );
				return;
			}

			screenarearesizer();
			$(window).resize( screenarearesizer );
			$(window).scroll( screenarearesizer );
		});