angular
	.module("tables", [])
	.controller("MainCtrl", function($scope) {
		$scope.init = function() {
			$scope.$elem = angular.element("#main");
			$scope.focusonthis = $scope.$elem.find("#focusonthis");

			angular.element(document)
				.off("keydown")
				.on("keydown", function(e) {
					var key = false;
					if (e.which >= 48 && e.which <= 57) {
						key = "num" + (e.which-48);
					}
					else if (e.which >= 96 && e.which <= 105) {
						key = "num" + (e.which-96);
					}
					else if (e.which == 8) {
						key = "keybs";
					}
					else if (e.which == 82) {
						window.location.reload();
					}
					else if (e.which == 83) {
						angular.element("#main")
							.find("a[href='#popupStart']").trigger("click");
					}
					else {
						console.log(e.which);
					}
					if (key) {
						angular.element("#main")
							.find("#"+key).trigger("focus").trigger("vclick");
					}
				});
		};

		// start
		//
		// next y
		//
		// next x
		//
		// stats - model
		//
		$scope.start = function() {
			$scope.poppedup = false;

			$scope.ys = angular._.shuffle([2,3,4,5,6,7,8,9,11,12]);
			$scope.y_index = 0;

			$scope.xs = angular._.shuffle([2,3,4,5,6,7,8,9,11,12]);
			$scope.x_answers = [0,0,0,0,0,0,0,0,0,0];
			$scope.x_index = 0;

			$scope.stats = [];
			$scope.answer_start = (new Date()).getTime();

			$scope.right = 0;
			$scope.wrong = 0;
			$scope.answer = "?";

		  $scope.start_time = Math.floor((new Date()).getTime()/1E3) + 5*60;
		  $scope.timer = "5:00";
		  setTimeout(function() { $scope.update_timer(); }, 667);
		};

		$scope.refresh = function() {};

		$scope.next_y = function() {
			$scope.y_index++; // check for done

			var xs = [2,3,4,5,6,7,8,9,11,12];
			$scope.xs = angular._.shuffle(xs);
			$scope.x_answers = [0,0,0,0,0,0,0,0,0,0];
			$scope.x_index = 0;

			var stats_clone = [];
			for(var i=0,n=$scope.stats.length; i<n; i++) {
				stats_clone.push(angular.extend({}, $scope.stats[i]));
			}

			var stats_per = [];
			for(var i=0,n=xs.length; i<n; i++) {
				var x = xs[i];
				var stats = angular._.filter(stats_clone, function(item) { return item.correct && (item.x == x || item.y == x)});
				var average = angular._.reduce(stats, function(sum, item) { return sum + item.ms_per_digit; }, 0) / stats.length;
				stats_per.push({x: x, ms_per_digit: Math.round(average)});
			}
			stats_per = _.sortBy(stats_per, 'ms_per_digit').reverse();

			console.log({stats: stats_per});
			console.log({stats: stats_clone});
			console.log({stats: $scope.stats});
		};

		$scope.next_x = function() {
			var x_index = $scope.x_index;
			var xs_length = $scope.xs.length;
			$scope.x_index = ($scope.x_index + 1) % xs_length;
			while($scope.x_answers[$scope.x_index] == 1 && ($scope.x_index != x_index)) {
				$scope.x_index = ($scope.x_index + 1) % xs_length; 
			}
			$scope.answer_start = (new Date()).getTime();
		};

		$scope.reset_buttons = function() {
			// reset button
			$scope.$elem.find("."+$scope.activeBtnClass).removeClass($scope.activeBtnClass);
			$scope.focusonthis.trigger("focus");
		};

		$scope.update_timer = function() {
			var old_timer = ""+$scope.timer;
			var new_time = $scope.start_time - Math.floor((new Date()).getTime()/1E3);
			var new_min = Math.floor(new_time / 60);
			var new_sec = (new_time - (new_min * 60));
			var new_timer = "0:00";

			// stop at zero
		  if (new_min >= 0 ) {
				new_timer = "" + new_min + ":" + (new_sec < 10 ? "0"+new_sec : new_sec);

				setTimeout(function() { $scope.update_timer(); }, 333 );
			}

			// only apply if different
			if (old_timer != new_timer) {
				$scope.timer = new_timer;
				$scope.$apply();
			}
		};

		$scope.$watch("answer", function(new_val/*, b*/) {
			if (new_val) {
				if (new_val !== "?") {
					var x = $scope.xs[$scope.x_index];
					var y = $scope.ys[$scope.y_index];
					var answer = x * y; 
					var digits = (""+answer).length;
					var ms = (new Date).getTime() - $scope.answer_start;

					if (parseInt(new_val, 10) == answer) {
						$scope.gotit_right = true;
						$scope.stats.push({x: x, y: y, correct: true, answer: answer, digits: digits, ms: ms, ms_per_digit: parseInt(ms / digits, 10)});
						setTimeout(function() { $scope.next(); }, 250);
					}
					else if ((""+new_val).length >= digits) {
						$scope.gotit_wrong = true;
						$scope.stats.push({x: x, y: y, correct: false, answer: answer, digits: digits, ms: ms, ms_per_digit: parseInt(ms / digits, 10)});
						setTimeout(function() { $scope.next(); }, 250);
					}
				}
			}
			if (!$scope.gotit_wrong && !$scope.gotit_right) {
				setTimeout(function(){ $scope.reset_buttons(true); }, 250);
			}
		});

		$scope.next = function() {
			$scope.reset_buttons();

			if ($scope.gotit_right) {
				$scope.right++;
				$scope.x_answers[$scope.x_index] = 1;
				if (angular._.reduce($scope.x_answers,function(a,b){return a+b}) == $scope.xs.length) {
					$scope.next_y();
				}
				else {
					$scope.next_x();
				}
			}
			else if ($scope.gotit_wrong) {
				$scope.wrong++;
				$scope.next_x();
			}

			$scope.answer = "?";
			$scope.gotit_right = false;
			$scope.gotit_wrong = false;
			$scope.$apply();
		};

		$scope.guess = function(num) {
			if ($scope.answer == "?") {
				if (angular.isString(num)) {
					setTimeout(function(){ $scope.reset_buttons(true); }, 250);
				}
				else {
					$scope.answer = ""+num;
				}
			}
			else if (!angular.isString(num)) {
				$scope.answer += ""+num;
			}
			else if (num == "bs") {
				$scope.answer = $scope.answer.replace(/.$/, "");
				if ($scope.answer.length == 0) {
					$scope.answer = "?";
				}
			}
		};

		$scope.close = function() {
			$scope.poppedup = false;
		};

		$scope.poppedup = false;
		$scope.xs = [ "X" ];
		$scope.x_index = 0;
		$scope.ys = [ "Y" ];
		$scope.y_index = 0;
		$scope.answer = "?";
		$scope.gotit_right = false;
		$scope.gotit_wrong = false;
		$scope.right = 0;
		$scope.wrong = 0;
		$scope.timer = "";
		$scope.activeBtnClass = angular.element.mobile.activeBtnClass;
	})
	.config(["$routeProvider", "$httpProvider",
		function($routeProvider, $httpProvider) {
			// content headers
			$httpProvider.defaults.headers.post = $httpProvider.defaults.headers.post || {};
			$httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";

			$httpProvider.defaults.headers.get = $httpProvider.defaults.headers.get || {};
			$httpProvider.defaults.headers.get.Accept = "application/x-javascript, text/plain, */*";

			var options = {transition: "slide", speed: "fast"};
			$routeProvider.when("/", {jqmOptions: options, templateUrl: "#main"});
		}])
	 .run(["$rootScope",
		function($rootScope) {
			$rootScope._ = angular._ = window._;
		}]);
