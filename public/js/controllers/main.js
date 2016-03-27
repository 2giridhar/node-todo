angular.module('foodController', [])

	// inject the Food service factory into our controller
	.controller('mainController', ['$scope','$http','Food', function($scope, $http, Food) {
		$scope.formData = {};
		$scope.loading = true;

		// GET =====================================================================
		// when landing on the page, get all food items and show them
		// use the service to get all the food items
		Food.get()
			.success(function(data) {
				$scope.food = data;
				$scope.gettotal();
			});

		$scope.gettotal = function() {
			// GET Total================================================================
			Food.getTotal()
				.success(function(data) {
					$scope.total = data;
					$scope.loading = false;
				});
		}


		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createFood = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.name != undefined && $scope.formData.price != undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				Food.create($scope.formData)

					// if successful creation, call our get function to get all the new food items
					.success(function(data) {
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.food = data; // assign our new list of food
						$scope.gettotal();
					});
			}
		};

		// DELETE ==================================================================
		// delete a food item after checking it
		$scope.deleteFood = function(id) {
			$scope.loading = true;

			Food.delete(id)
				// if successful creation, call our get function to get all the new food items
				.success(function(data) {
					$scope.food = data; // assign our new list of food items
					$scope.gettotal();
				});
		};
	}]);