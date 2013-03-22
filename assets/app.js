angular
	.module("tables", [])
	.controller("MainCtrl", function($scope) {
		$scope.init = function() {
			angular.element(document)
				.off("keydown")
				.on("keydown", function(e) {
					var key = false;
					if (e.which >= 48 && e.which <= 57) {
						key = "num" + (e.which-48);
					}
					else if(e.which >= 96 && e.which <= 105) {
						key = "num" + (e.which-96);
					}
					else if(e.which == 13) {
						key = "keyenter";
					}
					else if(e.which == 8) {
						key = "keybs";
					}
					if (key) {
						angular.element("#main")
							.find("#"+key).trigger("focus").trigger("vclick")
					}
				});
		};

		$scope.start = function() {
			$scope.index = 0;
			$scope.ok = [0,0,0,0,0,0,0,0,0,0,0,0,0];
			$scope.xs = angular._.shuffle([0,1,2,3,4,5,6,7,8,9,10,11,12]);
			$scope.x = $scope.xs[$scope.index]; 
			$scope.y = angular._.shuffle([0,1,2,3,4,5,6,7,8,9,10,11,12]).pop();
			$scope.answer = "?";
			$scope.wrong = 0;

		  $scope.correct = angular._.reduce($scope.ok, function(a,b){ return a+b; });
		  $scope.total = $scope.ok.length; 
		  $scope.running = true;
		  $scope.start_time = Math.floor((new Date()).getTime()/1E3) + 5*60;
		  $scope.timer = "5:00";

			var self = $scope;
		  setTimeout(function() { self.update_time()}, 667);
		};

		$scope.update_time = function() {
			var new_time = $scope.start_time - Math.floor((new Date()).getTime()/1E3);
			var new_min = Math.floor(new_time / 60);
			var new_sec = (new_time - (new_min * 60));
			$scope.timer = "" + new_min + ":" + (new_sec < 10 ? "0"+new_sec : new_sec);
		  $scope.$apply();

		  //TODO: Timer is zero - stop

			var self = $scope;
		  setTimeout(function() { self.update_time()}, 333 );
		};

		$scope.$watch("answer", function(a, b) {
			if(a) {
				var activeBtnClass = $scope.activeBtnClass;
				setTimeout(function(){
					angular.element("#main")
						.find("#focusonthis").trigger("focus").end()
						.find("."+activeBtnClass).removeClass(activeBtnClass);
				}, 500);

				if (a !== "?") {
					if (parseInt(a, 10) == ($scope.y * $scope.x)) {
						$scope.gotit_right = true;
						var self = $scope;
						setTimeout(function() { self.next(1); }, 600);
					}
					else if((""+a).length >= (""+($scope.y * $scope.x)).length) {
						$scope.gotit_wrong = true;
						var self = $scope;
						setTimeout(function() { self.next(0); }, 600);
					}
					$scope.$apply();
				}
			}
		});

		$scope.refresh = function() {
			console.log("refresh");
		};

		$scope.next = function(correct) {
			// todo - check for wrongs, reset after last one, etc
			$scope.ok[$scope.index] = correct;
			if (!correct) {
				$scope.wrong++;
			}
			$scope.correct = angular._.reduce($scope.ok, function(a,b){ return a+b; });
			if ($scope.correct == $scope.total) {
				// TODO: Done
				$scope.start();
			}
			else {
				var current_index = $scope.index;

				$scope.index = ($scope.index + 1) % $scope.total;
				while($scope.ok[$scope.index] == 1 && ($scope.index != current_index)) {
					$scope.index = ($scope.index + 1) % $scope.total;
				}
			}

			$scope.x = $scope.xs[$scope.index]; 
			$scope.answer = "?";
			$scope.gotit_right = false;
			$scope.gotit_wrong = false;
			$scope.$apply();
		};

		$scope.guess = function(num) {
			if ($scope.answer == "?") {
				if(!angular.isString(num)) {
					$scope.answer = ""+num;
				}
			}
			else if(!angular.isString(num)) {
				$scope.answer += ""+num;
			}
			else if(num == "bs") {
				$scope.answer = $scope.answer.replace(/.$/, "");
				if ($scope.answer.length == 0) {
					$scope.answer = "?";
				}
			}
			else if(num == "enter") {
				console.log("check answer");
			}
		};

		$scope.operator = "+";
		$scope.activeBtnClass = angular.element.mobile.activeBtnClass;
		$scope.index = -1;
		$scope.x = "X" 
		$scope.y = "Y" 
		$scope.answer = "?";
		$scope.gotit_right = false;
		$scope.gotit_wrong = false;
		$scope.correct = "x";
		$scope.total = "y"; 
		$scope.timer = "";
	})
	.config(["$routeProvider", "$httpProvider",
		function($routeProvider, $httpProvider) {
			// content headers
			$httpProvider.defaults.headers.post = $httpProvider.defaults.headers.post || {};
			$httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";

			$httpProvider.defaults.headers.get = $httpProvider.defaults.headers.get || {};
			$httpProvider.defaults.headers.get.Accept = "application/x-javascript, text/plain, */*";

			var options = {transition: "slide", speed: "fast"};
			$routeProvider.when("/", {jqmOptions: options, templateUrl: "#main"})
		}])
	 .run(["$rootScope",
		function($rootScope) {
			$rootScope._ = angular._ = window._;
		}]);
