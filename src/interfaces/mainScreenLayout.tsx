import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import React, { useMemo, useEffect } from 'react';
import createStyles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import Orientation from 'react-native-orientation-locker';

interface Props {
    children?: React.ReactNode;
    rightIconFalse: boolean;
    title: string;
    handleScroll: (event: any) => void;
    name: any
}

const MainScreenLayout = ({ children, rightIconFalse, title, handleScroll, name }: Props) => {
    const navigation = useNavigation();
    const theme = useSelector((state: any) => state.theme);
    const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
    useEffect(() => {
        if (name && name === "PdfViewer") {
            Orientation.unlockAllOrientations()
        }
        else {
            Orientation.lockToPortrait()
        }
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }} >
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => {
                            navigation.goBack();
                        }}>
                        <Ionicons name="chevron-back-outline" size={24} color="#ffffff" />
                    </TouchableOpacity>
                    {title && (
                        <View style={styles.header}>
                            <Text style={styles.headerText}>{title}</Text>
                        </View>
                    )}
                    {!rightIconFalse && (
                        <MaterialCommunityIcons
                            name="backup-restore"
                            size={30}
                            color="#ffffff"
                        />
                    )}
                    {rightIconFalse && (
                        // empty view
                        <View style={{ width: 30 }} />
                    )}
                </View>
            </View>
            <View style={styles.body}>
                <View style={styles.bodyContent}>
                    {children}
                </View>
            </View>
        </View>
    );
};

export default MainScreenLayout;
