<?php 

// Function to create response
function createResponse($status, $message, $payload) 
{
	return response()
		->json(['status' 	=> $status, 
			'message' 		=> $message, 
			'payload' 		=> $payload
		], $status);
}
