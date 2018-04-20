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
                $res = json_decode($result,true);
            }
            return createResponse(config('httpResponse.SUCCESS'), 
                    'Coin data'),
                    ['data' => $res]);
        } catch (\Exception $e) {
            \Log::error("Coin listing error: ".$e);
            return createResponse(config('httpResponse.SERVER_ERROR'), 
                'Error while getting coin data',
                ['error' => 'Error while getting coin data']);
        }
    }

    public function multiRequestApi($data, $options = array())
    {
        $result = array();
        foreach ($data as $id => $d) {

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL,$d);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $op = curl_exec ($ch);
            curl_close ($ch);
            $res = json_decode($op);
            $result[$id] = $res;
        }
         
        return json_encode($result);
    }

    public function trades($coin)
    {
        try
        {
            $headers = array();
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_USERAGENT,
                'Mozilla/4.0 (compatible; MtGox PHP Client; ' . php_uname('s') . '; PHP/' .
                phpversion() . ')');
            curl_setopt($ch, CURLOPT_URL, 'https://www.bitstamp.net/api/v2/transactions/'.$coin.'/');
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);

            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

            $res2 = curl_exec($ch);
            if ($res2 === false)
                throw new \Exception('Could not get reply: ' . curl_error($ch));
            
            curl_close($ch);
            $res = json_decode($res2,true);
            $res = array_values($res);
            $res = array_slice( $res, 0, 10, true);
            return createResponse(config('httpResponse.SUCCESS'), 
                'Live trades'),
                ['data' => $res]);

        } catch (\Exception $e) {
            \Log::error("Coin listing error: ".$e);
            return createResponse(config('httpResponse.SERVER_ERROR'), 
                'Error while getting live trades',
                ['error' => 'Error while getting live trades']);
        }
    }

    public function orderBook($coin)
    {
        try
        {
            $headers = array();
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_USERAGENT,
                'Mozilla/4.0 (compatible; MtGox PHP Client; ' . php_uname('s') . '; PHP/' .
                phpversion() . ')');
            curl_setopt($ch, CURLOPT_URL, 'https://www.bitstamp.net/api/v2/order_book/'.$coin);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);

            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

            $res1 = curl_exec($ch);
            if ($res1 === false)
                throw new \Exception('Could not get reply: ' . curl_error($ch));
            
            curl_close($ch);
            $res = json_decode($res1);
            $bids = $res->bids;
            $bids = array_slice( $bids, 0, 10, true);
            $asks = $res->asks;
            $asks = array_slice( $asks, 0, 10, true);
            $res->bids = $bids;
            $res->asks = $asks;
            return createResponse(config('httpResponse.SUCCESS'), 
                'Order book'),
                ['data' => $res]);

        } catch (\Exception $e) {
            \Log::error("Coin listing error: ".$e);
            return createResponse(config('httpResponse.SERVER_ERROR'), 
                'Error while getting order book',
                ['error' => 'Error while getting order book' ]);
        }
    }
}
