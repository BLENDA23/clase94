import React, { Component } from 'react';
import { Text, View, Alert,StyleSheet,FlatList } from 'react-native';
import axios from "axios";

export default class MeteorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meteors: {},
        };
    }

    componentDidMount() {
        this.getMeteors()
    }

    getMeteors = () => {
        axios
            .get("https://api.nasa.gov/neo/rest/v1/feed?api_key=nAkq24DJ2dHxzqXyzfdreTvczCVOnwJuFLFq4bDZ")
            .then(response => {
                this.setState({ meteors: response.data.near_earth_objects })
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }

    render() {
        if (Object.keys(this.state.meteors).length === 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Text>Cargando</Text>
                </View>
            )
        } else {
            let meteor_arr = Object.keys(this.state.meteors).map(meteor_date => {
                return this.state.meteors[meteor_date]
            })
            let meteors = [].concat.apply([], meteor_arr);

            meteors.forEach(function (element) {
                let diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max) / 2
                let threatScore = (diameter / element.close_approach_data[0].miss_distance.kilometers) * 1000000000
                element.threat_score = threatScore;
            });

            return (
                <View style={styles.container}>
                    <FlatList
                        data={meteors}  // Utiliza la lista de meteoritos para la propiedad 'data'
                        renderItem={({ item }) => (
                            // Renderiza cada meteorito con su puntuación
                            <View style={styles.itemContainer}>
                                <Text style={styles.meteorName}>{item.name}</Text>
                                <Text style={styles.threatScore}>Threat Score: {item.threat_score}</Text>
                                {/* Agrega más detalles o estilos según sea necesario */}
                            </View>
                        )}
                        
                    />
                </View>
            );

        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
   
    titleBar: {
        flex: 0.15,
        justifyContent: "center",
        alignItems: "center"
    },
    titleText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white"
    },
    itemContainer: {
        backgroundColor: "#fff",  // Color de fondo de la tarjeta
        padding: 16,  // Espaciado interno de la tarjeta
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,  // Bordes redondeados
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,  // Elevación para la sombra en Android
    },
    meteorName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,  // Margen inferior para separar el nombre de la puntuación
    },
    threatScore: {
        fontSize: 16,
        color: "red",
    },
});