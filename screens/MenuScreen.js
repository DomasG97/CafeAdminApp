import React from 'react';
import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import Firebase from '../firebaseConfig';
import { getDatabase, ref, onValue, set } from 'firebase/database';

export default function MenuScreen({navigation}) {
    const [type, setType] = useState('')
    const [size, setSize] = useState('')
    const [price, setPrice] = useState('')
    const [items, setItems] = useState([])

    useEffect(() =>  {
        const db = getDatabase(Firebase)
        const menuRef = ref(db, 'menu/coffee/')
        onValue(menuRef, (snapshot) => {
            setItems([])
            snapshot.forEach((child) => {
                const newObj = {
                    type: child.key,
                    size: child.val().size,
                    price: child.val().price
                }
                setItems(emptyArray => [...emptyArray, newObj]);
            })
        })
    }, [])

    function addCoffee() {
        const db = getDatabase(Firebase)
        set(ref(db, 'menu/coffee/' + type + " " + size), {
            size: size,
            price: parseFloat(price)
        })
        .then(() => {
            setType('')
            setSize('')
            setPrice('')
        })
    }

    return(
        <View style={styles.screen}>
            <Text style={styles.title}>Menu</Text>
            <View style={styles.horizontalLine}></View>
            <View>
            <FlatList
                    data={items}
                    renderItem={({item}) => {
                        return(
                            <View style={styles.item}>     
                                <View style = {{flexDirection: 'column'}}>
                                    <Text style={{fontWeight: 'bold', fontSize: 15}}>{item.type}</Text>
                                    <Text>Size: {item.size}</Text>
                                    <Text>Price: {item.price}$</Text>
                                </View>
                            </View>
                        );
                    }}
                />
            </View>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Type"
                    value={type}
                    onChangeText={(text) => setType(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Size"
                    value={size}
                    onChangeText={(text) => setSize(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Price"
                    value={price}
                    onChangeText={(text) => setPrice(text)}
                />
                <TouchableOpacity 
                    style={styles.button}
                    onPress={addCoffee}>
                    <Text>Add coffee</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        minHeight: Dimensions.get('window').height,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: 130,
        paddingBottom: 180,
        justifyContent: 'center'
    },
    input: {
        width: 200,
        borderBottomWidth: 3,
        borderBottomColor: 'brown',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingTop: 20,
        paddingBottom: 10,
        textShadowColor: 'grey',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
        elevation: 5
    },
    horizontalLine: {
        width: Dimensions.get('window').width - 20,
        borderBottomWidth: 3,
        borderBottomColor: 'brown',
        borderRadius: 100,
        marginTop: 5,
        marginBottom: 15
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        width: Dimensions.get('window').width - 20,
        marginBottom: 20,
        borderWidth: 3,
        borderRadius: 70,
        borderColor: 'brown',
        borderStyle: 'solid',
    },
    button: {
        borderWidth: 3,
        borderColor: 'lightblue',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 10,
        backgroundColor: 'white',
        borderRadius: 40,
        margin: 20
    }
})