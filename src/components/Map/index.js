import React, {useState, useEffect} from 'react';
import { View, PermissionsAndroid } from 'react-native';
import MapView from 'react-native-maps'
import Geolocation from 'react-native-geolocation-service';
import Search from '../Search'
import Directions from '../Directions'

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
    }
}

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

    useEffect(() => {
        checkLocationPermition = requestLocationPermition()

        if(checkLocationPermition){
            Geolocation.getCurrentPosition(
                (position) => {
                    const {coords} = position
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
            style={{flex: 1}}
            region={state.region}
            showsUserLocation
            loadingEnabled
        >
            {state.destination.title ? (
                <Directions
                    origin={state.region}
                    destination={state.destination}
                    onReady={() => {}}
                />
            ) : null}
        </MapView>
        <Search onLocationSelected={handleLocationSelected}/>
    </View>;
}

export default Map;