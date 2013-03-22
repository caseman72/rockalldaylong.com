angular
	.module("tables", [])
	.controller("MainCtrl", function($scope) {
		$scope.init = function() {
			console.log("init");

			$scope.index = 0;
			$scope.ok = [0,0,0,0,0,0,0,0,0,0,0,0,0];
			$scope.xs = angular._.shuffle([0,1,2,3,4,5,6,7,8,9,10,11,12]);
			$scope.x = $scope.xs[$scope.index]; 
			$scope.y = angular._.shuffle([0,1,2,3,4,5,6,7,8,9,10,11,12]).pop();
			$scope.answer = "?";

		  $scope.correct = angular._.reduce($scope.ok, function(a,b){ return a+b; });
		  $scope.total = $scope.ok.length; 

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

		$scope.$watch("answer", function(a, b) {
			if(a) {
				setTimeout(function(){ angular.element("#focusonthis").trigger("focus"); }, 600);

				if (a !== "?" && parseInt(a, 10) == ($scope.y * $scope.x)) {
					$scope.gotit_right = true;
					var self = $scope;
					setTimeout(function() { self.next(); }, 600);
				}
			}
		});

		$scope.next = function() {
			// todo - check for wrongs, reset after last one, etc
			$scope.ok[$scope.index] = 1;
			$scope.index++;
			$scope.x = $scope.xs[$scope.index]; 
			$scope.answer = "?";
			$scope.gotit_right = false;
			$scope.correct = angular._.reduce($scope.ok, function(a,b){ return a+b; });
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

		$scope.refresh = function() {
			console.log("refresh");
		};

		$scope.operator = "+";
		$scope.focusBtnClass = "ui-focus";
		$scope.activeBtnClass = "ui-active";
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
	 .run(["$rootScope", "$location",
		function($rootScope, $location) {
			$rootScope._ = angular._ = window._;
			// watch location changes for 404s
			$rootScope.$watch(function() {
				return $location.path();
			},
			function(to_path, from_path) {
				console.log("to_path", to_path, "from_path", from_path);
			});
		}]);
