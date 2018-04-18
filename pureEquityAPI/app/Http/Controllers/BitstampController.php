<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BitstampController extends Controller
{
    public function coins(Request $request, $coin = '')
    {
    	try
    	{
    		if($coin != '')
    		{
    			$ch = curl_init();
				curl_setopt($ch, CURLOPT_URL,"https://www.bitstamp.net/api/v2/ticker/".$coin);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				$op = curl_exec ($ch);
				curl_close ($ch);
				$res = json_decode($op);
    		}
    		else
    		{
    			$data = array(
	                'btcusd' => 'https://www.bitstamp.net/api/v2/ticker/btcusd',
	                'btceur' => 'https://www.bitstamp.net/api/v2/ticker/btceur',
	                'eurusd' => 'https://www.bitstamp.net/api/v2/ticker/eurusd',
	                'xrpusd' => 'https://www.bitstamp.net/api/v2/ticker/xrpusd',
	                'xrpeur' => 'https://www.bitstamp.net/api/v2/ticker/xrpeur',
	                'xrpbtc' => 'https://www.bitstamp.net/api/v2/ticker/xrpbtc',
	                'ltcusd' => 'https://www.bitstamp.net/api/v2/ticker/ltcusd',
	                'ltceur' => 'https://www.bitstamp.net/api/v2/ticker/ltceur',
	                'ltcbtc' => 'https://www.bitstamp.net/api/v2/ticker/ltcbtc',
	                'ethusd' => 'https://www.bitstamp.net/api/v2/ticker/ethusd',
	                'etheur' => 'https://www.bitstamp.net/api/v2/ticker/etheur',
	                'ethbtc' => 'https://www.bitstamp.net/api/v2/ticker/ethbtc',
	                'bchusd' => 'https://www.bitstamp.net/api/v2/ticker/bchusd',
	                'bcheur' => 'https://www.bitstamp.net/api/v2/ticker/bcheur',
	                'bchbtc' => 'https://www.bitstamp.net/api/v2/ticker/bchbtc'
	            );
	            $result = $this->multiRequestApi($data);
	            $results = json_decode($result);
	            
	        	if ($results == "") 
	                $res = false;
	            else
	            {
	                // store role details
	                foreach ($results as $key => $res)
	                    $arr[$key] = json_decode($res);
	                
	                $json = array('flag'=>'0','msg'=> "added successfully");
	                //return json_encode($json);

	                $res = $arr;
	            }
    		}

	    	$array = ['btcusd', 'btceur', 'eurusd', 'xrpusd', 'xrpeur', 'xrpbtc', 'ltcusd', 'ltceur', 'ltcbtc', 'ethusd', 'etheur', 'ethbtc', 'bchusd', 'bcheur', 'bchbtc'];

			return createResponse(config('httpResponse.SUCCESS'), 
	                trans('messages.LIST_SUCCESS', ['name' => 'Coin']),
	                ['data' => $res]);
        } catch (\Exception $e) {
            \Log::error("Coin listing error: ".$e);
            return createResponse(config('httpResponse.SERVER_ERROR'), 
                trans('messages.LIST_ERROR', ['name' => 'Coin']),
                ['error' => trans('messages.LIST_ERROR', ['name' => 'Coin'])]);
        }
    }

    public function multiRequestApi($data, $options = array())
    {
        // array of curl handles
        $curly = array();
        // data to be returned
        $result = array();
         
        // multi handle
        $mh = curl_multi_init();

        foreach ($data as $id => $d) {
    
            $curly[$id] = curl_init();
             
            $url = (is_array($d) && !empty($d['url'])) ? $d['url'] : $d;

            curl_setopt($curly[$id], CURLOPT_URL,            $url);
            curl_setopt($curly[$id], CURLOPT_HEADER,         0);
            curl_setopt($curly[$id], CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curly[$id], CURLOPT_USERAGENT,'Mozilla/4.0 (compatible; MtGox PHP Client; ' . php_uname('s') . '; PHP/' .
            phpversion() . ')');
            curl_setopt($curly[$id], CURLOPT_SSL_VERIFYPEER, 1); 
            curl_setopt($curly[$id], CURLOPT_SSL_VERIFYHOST, 2);
            // post?
            if (is_array($d)) {
                if (!empty($d['post'])) {
                    curl_setopt($curly[$id], CURLOPT_POST, 1);
                    curl_setopt($curly[$id], CURLOPT_POSTFIELDS, $d['post']);
                }
            }
             
            // extra options?
            if (!empty($options))
                curl_setopt_array($curly[$id], $options);
         
            curl_multi_add_handle($mh, $curly[$id]);
        }
         
        // execute the handles
        $running = null;
        do {
            curl_multi_exec($mh, $running);
        } while($running > 0);
         
         
        // get content and remove handles
        foreach($curly as $id => $c) {
            $result[$id] = curl_multi_getcontent($c);
            curl_multi_remove_handle($mh, $c);
        }
         
        // all done
        curl_multi_close($mh);
         
        return json_encode($result);
    }
}
