
		var BoxModel = Backbone.Model.extend({
			defaults:{
				"clicked":false
			}
		});
		var BoxModel_View = Backbone.View.extend({
			tagName:"div",
			className: function(){
				return "box box-"+this.model.get("boxtype")+" small"
			},
			render: function(){
				this.$el.html( this.model.get("content_small")||$( "#"+this.model.get("content_id") ).html() );
				return this;
			},
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
			model:BoxModel,
		});
		var BoxModelCollection_View = Backbone.View.extend({
			render: function(){
				this.collection.each( this.addBox,this );
				// console.log(this.collection.bar_name);
				return this;
			},
			addBox: function( box ){
				var temp = new BoxModel_View( { model:box } );
				this.$el.append( temp.render().el );
			},
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