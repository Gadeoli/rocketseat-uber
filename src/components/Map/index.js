import React, {useState, useEffect, createRef} from 'react'
import { View, Image, PermissionsAndroid } from 'react-native'
import MapView, {Marker} from 'react-native-maps'
import Geolocation from 'react-native-geolocation-service'
import Geocoder from 'react-native-geocoding'

import { GOOGLE_API_KEY } from 'react-native-dotenv'
import Directions from '../Directions'
import Details from '../Details'
import Search from '../Search'
import {getPixelSize} from '../../utils'
import { 
    LocationBox, 
    LocationText,
    LocationTimeBox,
    LocationTimeText,
    LocationTimeSmall,
    Back
} from './styles'

import markerImage from '../../assets/marker.png'
import backImage from '../../assets/back.png'

const initialState = {
    region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0143,
        longitudeDelta: 0.0134
    },
    destination: {
        latitude: 0,
        longitude: 0,
        title: ''
    },
    duration: null,
    location: 'Estou aqui!'
}

Geocoder.init(GOOGLE_API_KEY)

const requestLocationPermition = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: 'Permissão necessária',
                message: 'O app precisa da sua localização',
                buttonPositive: 'Sim',
                buttonNegative: 'Não'
            }
        )

        if(granted === PermissionsAndroid.RESULTS.GRANTED){
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const Map = () => {

    const [state, setState] = useState({...initialState})
    const {region} = state
    const {latitude, longitude} = region
    const mapViewRef = createRef()

    const handleLocationSelected = (data, {geometry}) => {
        const {location: {lat: latitude, lng: longitude} } = geometry
        setState({
            ...state,
            destination: {
                latitude,
                longitude,
                title: data.structured_formatting.main_text
            }
        })
    }

    const handleBack = () => {
        setState({
            ...state,
            destination: {...initialState.destination}
        })
    }

    //Not tested
    //Need to add billing on google console
    const getGeoCoderAddress = async ({latitude, longitude}) => {
        /*
        const res = await Geocoder.from({ latitude, longitude })
        //console.log(res)

        const address = res.results[0].formatted_address
        const location = address.substring(0, address.indexOf(','))

        setState({...state, location})
        */
    }

    useEffect(() => {
        checkLocationPermition = requestLocationPermition()

        if(checkLocationPermition){
            Geolocation.getCurrentPosition(
                (position) => {
                    const {coords} = position
                    getGeoCoderAddress(coords)

                    setState({
                        ...state, 
                        region: {
                            ...state.region,
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                        }
                    })
                },
                (error) => {
                    // See error code charts below.
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }else{
            console.log('Sem permissão para localização')
        }
    }, [latitude, longitude])

    return <View style={{flex: 1}}>
        <MapView
            ref={mapViewRef}
            style={{flex: 1}}
            region={state.region}
            showsUserLocation
            loadingEnabled
        >
            {state.destination.title ? (
                <>
                    <Directions
                        origin={state.region}
                        destination={state.destination}
                        onReady={result => {
                            setState({...state, duration: Math.floor(result.duration)})
                            if(mapViewRef){
                                mapViewRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        top: getPixelSize(50), 
                                        bottom: getPixelSize(50), 
                                        left: getPixelSize(50), 
                                        right: getPixelSize(350)
                                    }
                                })
                            }
                        }}
                    />
                    <Marker 
                        coordinate={state.destination}
                        anchor={{ x: 0, y: 0 }}
                        image={markerImage}
                    >
                        <LocationBox>
                            <LocationText>{state.destination.title}</LocationText>
                        </LocationBox>
                    </Marker>
                    <Marker 
                        coordinate={state.region}
                        anchor={{ x: 0, y: 0 }}
                    >
                        <LocationBox>
                            <LocationTimeBox>
                                <LocationTimeText>{state.duration}</LocationTimeText>
                                <LocationTimeSmall>MIN</LocationTimeSmall>
                            </LocationTimeBox>
                            <LocationText>{state.location}</LocationText>
                        </LocationBox>
                    </Marker>
                </>
            ) : null}
        </MapView>
        {
            state.destination.title ? 
                <>
                    <Back onPress={handleBack}>
                        <Image source={backImage} />
                    </Back>
                    <Details />
                </> : 
                <Search onLocationSelected={handleLocationSelected}/>
        }
        
    </View>;
}

export default Map;