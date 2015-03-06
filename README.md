# Concur Web Flow Sample

Configurable and zero-coding Concur Web Flow live demo in Heroku. You don't need to know Heroku to get this up and running. Watch this [short 3-minute video](https://www.youtube.com/watch?v=B0VGBSIVXuM) on how to set one up.

Below is a screenshot from the video:

![ConcurWebFlowPicture](https://jfqcza.bn1301.livefilestore.com/y2pZ0pdKqmy8AzeODiNJFtzlHcbkmsb4iGV487n-PCeK8RPHXFsE1i-mczJ3bNJqSTeBjnSKC47yFAntw_2bwUnlJG6rHv6a68v7MtD9eABnOyW8MDhb3RsxiRRPgkvuZW3PfVYrtuphEmJ-yjkT_oMlQ/CaptureConcurWebFlow.PNG?psid=1)

You can also try a pre-configured live demo sample [here](https://stark-island-9579.herokuapp.com/)

## Deploying to Heroku

Click the button below to deploy to your Heroku account.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Important Notes

The only `SCOPE`s supported for now are `ITINER` (Itinerary) and `ERECPT` (E-Receipts). You can only use one at a time.  
For Itinerary, you need to have existing itineraries in your Concur sandbox.  For E-Receipts, you need to have your E-Receipt API access turned on, to submit an E-Receipt successfully. Consult with your Concur rep, or email chris.ismael@concur.com.
For more information on the Concur Web Flow, click [here](https://developer.concur.com/oauth-20/web-flow)