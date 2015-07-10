	//.bar height & .boxstructure_wrapper width
	function barheight(){
		//.bar height
		$(".bar").each( 
			function( i ){
				var boxesheight = 0;
				$(this).parent().children(".boxes").each( 
					function(i){
						boxesheight = Math.max( boxesheight,$(this).height() )
					}
				);
				$(this).height( boxesheight - 6 );
				$(this).ellipsis( options={ellipsis:""} );
			}
		);
	}
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
	}

	function barheightboxstructurewrapperwidth(){
		barheight();
		boxstructurewrapperwidth();
	}
	barheight();
	boxstructurewrapperwidth();
