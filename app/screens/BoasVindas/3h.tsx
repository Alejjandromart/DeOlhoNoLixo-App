import { Text,View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import React from "react";

export default function ThreeH() {
    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor: '#0A3849'}}>
            <Text style={{color: '#FFF', fontSize: 60, textAlign: 'center', margin: 20, fontWeight: 'bold'}}>
                5h pra que?{"\n"}
                5h para fazer issooo!!!!
            </Text>
            // botao para voltar para Onboarding
            router.push('../screens/BoasVindas/3h');


        </View>
    )
}