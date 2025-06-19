import {ActivityIndicator, Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Pdf from 'react-native-pdf';
import { useRoute } from '@react-navigation/native';

const ViewScreen = () => {
  const route = useRoute();
  const { url } = route.params;

  return (
    <View style={styles.container}>
                <Pdf
                    trustAllCerts={false}
                    horizontal
                    enablePaging={true}
                    onLoadProgress={()=><ActivityIndicator size="large" color="red" />}
                    source={{ uri: url }}
                    // source={{uri: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}}
                    onLoadComplete={(numberOfPages,filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}/>
            </View>
  );
};

export default ViewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});
