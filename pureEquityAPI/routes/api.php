<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('test',function(){ ini_set('max_execution_time', 300);
	return 1; });
Route::group(['prefix' => 'v1'], function() {

	// Verify user email address after registration
	Route::get('coins/{coin?}','BitstampController@coins');

}); // End of prefix v1.0 group

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
