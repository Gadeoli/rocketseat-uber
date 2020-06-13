import React from 'react'
import { View } from 'react-native'
import MapView from 'react-native-maps'

const App = () => {
    return <View style={{flex: 1}}>
        <MapView 
            style={{flex: 1}}
            region={{
                latitude: 37.3588,
                longitude: -122.0895,
                latitudeDelta: 0.0143,
                longitudeDelta: 0.0134
            }}
            showsUserLocation
            loadingEnabled
        />
    </View>
}

export default App