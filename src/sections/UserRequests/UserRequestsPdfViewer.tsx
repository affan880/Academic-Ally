import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'native-base';
import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Pdf from 'react-native-pdf';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import createStyles from './styles';

const { width, height } = Dimensions.get('window');
type RootStackParamList = {
    NotesList: {
        userData: {
            course: string;
            branch: string;
            sem: string;
        };
        notesData: any;
        selected: string;
        subject: string;
        item: string;
    };
};

type MyStackParamList = {
    PdfViewer: {
        userData: {
            course: string;
            branch: string;
            sem: string;
        };
        notesData: any;
        selected: string;
        subject: string;
    };
};

type MyScreenNavigationProp = StackNavigationProp<
    MyStackParamList,
    'PdfViewer'
>;

const UserRequestsPdfViewer = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'NotesList'>>();
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage]: any = useState(0);
    const { item } = route.params;
    const [pageNo, setPageNo] = useState(0);
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState(`${item}`);
    const source = {
        uri: url,
        // uri: `https://drive.google.com/u/0/uc?id=${notesData.did}`,
        cache: true,
        expiration: 60 * 60 * 24 * 7,
    };
    const theme = useSelector((state: any) => {
        return state.theme;
    });
    const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
    const pdfRef = useRef(null);
    const navigation = useNavigation<MyScreenNavigationProp>();

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Ionicons
                    name="chevron-back-outline"
                    size={20}
                    color="#ffffff"
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        paddingRight: 10,
                    }}>
                    <TextInput
                        style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#ffffff',
                            width: '50%',
                            paddingVertical: -2,
                            textAlign: 'right',
                            left: 2,
                            top: -1,
                        }}
                        value={`${currentPage}`}
                        onChangeText={(text: any) => setCurrentPage(text)}
                        keyboardType="number-pad"
                        maxLength={3}
                        onSubmitEditing={() => {
                            setPageNo(parseInt(currentPage));
                        }}
                    />
                    <Text style={{ fontSize: 18, color: '#ffffff', fontWeight: 'bold' }}>
                        /{totalPages}
                    </Text>
                </View>

                <Fontisto name="history" size={20} color="#ffffff" />
            </View>
            <View style={styles.body}>
                <View>
                    <View style={pdfStyle.container}>
                        <Pdf
                            ref={pdfRef}
                            trustAllCerts={false}
                            source={source}
                            scale={1}
                            spacing={10}
                            enableRTL={true}
                            enableAnnotationRendering={true}
                            onLoadComplete={(numberOfPages, filePath) => {
                                setLoading(false);
                            }}
                            onPageChanged={(page, numberOfPages) => {
                                setCurrentPage(page);
                                setTotalPages(numberOfPages);
                            }}
                            page={pageNo}
                            renderActivityIndicator={progress => {
                                var progressBar = progress * 100;
                                return (
                                    <View>
                                        <ActivityIndicator
                                            animating={true}
                                            color="#FF8181"
                                            size="large"
                                        />
                                        <Text style={{ textAlign: 'center' }}>
                                            {progressBar.toFixed(2)}% Loaded
                                        </Text>
                                    </View>
                                );
                            }}
                            onError={error => {
                                console.log(error);
                            }}
                            style={pdfStyle.pdf}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default UserRequestsPdfViewer;
const pdfStyle = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
    },
    pdf: {
        width: width,
        height: height,
        borderRadius: 40,
        marginBottom: 0,
    },
});
