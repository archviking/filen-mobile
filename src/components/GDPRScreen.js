import React, { useState, useEffect } from "react"
import { View, Text, Platform, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { storage } from "../lib/storage"
import { useMMKVBoolean, useMMKVString } from "react-native-mmkv"
import Ionicon from "react-native-vector-icons/Ionicons"
import { i18n } from "../i18n/i18n"
import { showToast } from "./Toasts"
import { fetchGDPRInfo } from "../lib/api"
import { useMountedState } from "react-use"

export const GDPRScreen = ({ navigation, route }) => {
    const [darkMode, setDarkMode] = useMMKVBoolean("darkMode", storage)
    const [lang, setLang] = useMMKVString("lang", storage)
    const [gdpr, setGdpr] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const isMounted = useMountedState()
    
    useEffect(() => {
        fetchGDPRInfo().then((info) => {
            if(isMounted()){
                setGdpr(JSON.stringify(info, null, 2))
                setIsLoading(false)
            }
        }).catch((err) => {
            console.log(err)

            showToast({ message: err.toString() })
        })
    }, [])

    return (
        <>
            <View style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                backgroundColor: darkMode ? "black" : "white"
            }}>
                <TouchableOpacity style={{
                    marginTop: Platform.OS == "ios" ? 17 : 4,
                    marginLeft: 15,
                }} onPress={() => navigation.goBack()}>
                    <Ionicon name="chevron-back" size={24} color={darkMode ? "white" : "black"}></Ionicon>
                </TouchableOpacity>
                <Text style={{
                    color: darkMode ? "white" : "black",
                    fontWeight: "bold",
                    fontSize: 24,
                    marginLeft: 10,
                    marginTop: Platform.OS == "ios" ? 15 : 0
                }}>
                    {i18n(lang, "showGDPR")}
                </Text>
            </View>
            <ScrollView style={{
                height: "100%",
                width: "100%",
                backgroundColor: darkMode ? "black" : "white"
            }}>
                {
                    isLoading ? (
                        <ActivityIndicator size={"small"} color={darkMode ? "white" : "black"} style={{
                            marginTop: "70%"
                        }} />
                    ) : (
                        <Text style={{
                            color: darkMode ? "white" : "black",
                            padding: 22
                        }}>
                            {gdpr}    
                        </Text>
                    )
                }
            </ScrollView>
        </>
    )
}