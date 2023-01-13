import React from 'react';
import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { getDatabase, ref, onValue, set, update, remove } from 'firebase/database';
import Firebase from '../firebaseConfig';

export default function OrdersScreen({navigation}) {
    const [orders, setOrders] = useState([])
    const [order, setOrder] = useState([])
    const [total, setTotal] = useState(0)
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        const db = getDatabase(Firebase)
        const orderRef = ref(db, 'orders/')
        onValue(orderRef, (snapshot) => {
            setOrders([])
            snapshot.forEach((child) => {
                const newObj = {
                    orderId: child.key,
                    order: child.val().order,
                    total: child.val().total,
                    preparing: child.val().preparing,
                    finished: child.val().finished
                }
                setOrders(emptyArray => [...emptyArray, newObj])
            })
        })
    }, [])

    function checkForOrders() {
        if(orders.length === 0) {
            return <Text>No orders at the moment</Text>
        }
    }

    function openOrder({item}) {
        setOrder(emptyArray => item)
        setTotal(item.total)
        setModalVisible(true)
    }

    function getOrderStatus() {
        if(order.preparing === false) {
            return <Text style={{fontWeight: 'bold', fontSize: 15, color: 'red'}}>Accept</Text>
        }
        else if(order.preparing === true && order.finished === false) {
            return <Text style={{fontWeight: 'bold', fontSize: 15, color: 'orange'}}>Finished</Text>
        }
        else {
            return <Text style={{fontWeight: 'bold', color: 'green'}}>Remove</Text>
        }
    }

    function changeOrderStatus() {
        if(order.preparing === false) {
            updatePreparing()
            setModalVisible(false)
            setModalVisible(true)
        }
        else if(order.preparing === true && order.finished === false) {
            updateFinished()
            setModalVisible(false)
            setModalVisible(true)
        }
        else {
            deleteOrder()
            setModalVisible(false)
        }
    }

    function updatePreparing() {
        const db = getDatabase(Firebase)
        const orderRef = ref(db, 'orders/' + order.orderId)
        update(orderRef, {'preparing': true})
    }

    function updateFinished() {
        const db = getDatabase(Firebase)
        const orderRef = ref(db, 'orders/' + order.orderId)
        update(orderRef, {'finished': true})
    }

    function deleteOrder() {
        const db = getDatabase(Firebase)
        const orderRef = ref(db, 'orders/' + order.orderId)
        remove(orderRef)
    }

    return(
        <View style={styles.screen}>
            <Text style={styles.title}>Orders</Text>
            <Text>{checkForOrders()}</Text>
            <View>
                <FlatList
                    data={orders}
                    renderItem={({item}) => {
                        return(
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => openOrder({item})}>       
                                <View style = {{flexDirection: 'column'}}>
                                    <Text style={{fontWeight: 'bold', fontSize: 18}}>{item.orderId}</Text>
                                    <View></View>
                                    <Text>Total: {item.total.toFixed(2)}$</Text>
                                </View>
                            </TouchableOpacity>
                        );
                }}/>
            </View>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('Menu')}>
                <Text>Cafe menu</Text>
            </TouchableOpacity>
            <Modal 
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}>
                <View style={styles.modalScreen}>
                    <View style={styles.modalView}>
                        <View style={styles.modalListView}>
                            <FlatList
                                data={order.order}
                                renderItem={({item}) => {
                                    return(
                                        <View>
                                            <View style={styles.modalItem}>
                                                <Text style={{fontWeight: 'bold', fontSize: 15}}>{item.type}</Text>
                                                <Text>Price: {item.price.toFixed(2)}$</Text>
                                            </View>
                                        </View>
                                    );
                                }}
                            />
                        </View>
                        <View style={{padding: 20}}>
                            <Text style={styles.totalPriceText}>Total: {total.toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={() => {changeOrderStatus()}}>
                            {getOrderStatus()}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        height: Dimensions.get('window').height,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: 100,
        paddingBottom: 100,
        justifyContent: 'center'
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
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
        width: Dimensions.get('window').width - 20,
        marginBottom: 20,
        borderWidth: 3,
        borderRadius: 70,
        borderColor: 'lightblue',
        borderStyle: 'solid'
    },
    button: {
        borderWidth: 3,
        borderColor: 'lightblue',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderRadius: 40,
        margin: 20
    },
    modalScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: Dimensions.get('window').height - 60,
        width: Dimensions.get('window').width - 30,
        backgroundColor: 'white',
        borderWidth: 3,
        borderRadius: 50,
        borderColor: "lightblue",
    },
    modalListView: {
        maxHeight: Dimensions.get('window').height - 300,
        width: Dimensions.get('window').width - 40,
    },
    modalItem: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: 70,
        width: Dimensions.get('window').width - 20,
        marginBottom: 20,
        paddingLeft: 20,
        borderBottomWidth: 3,
        borderRadius: 10,
        borderBottomColor: 'lightgrey',
    },
    totalPriceText: {
        fontSize: 20,
        fontWeight: 'bold'
    }
})