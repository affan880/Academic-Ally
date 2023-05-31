import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Actionsheet, Box, Card, Center, Checkbox, Icon, Modal, Stack, Text, Toast, useDisclose } from 'native-base';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import SwipeableRating from 'react-native-swipeable-rating';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { LinkPreview } from '@flyerhq/react-native-link-preview'

import { ReportIconBlack, ReportIconWhite } from '../../assets/images/images';
import UserRequestsActions from '../../screens/UserRequests/UserRequestsActions';
import NavigationService from '../../services/NavigationService';
import createStyles from './styles';

type Props = {
    item: any;
    userData: any;
    notesData: any;
    selected: string;
    subject: string;
};
type RootStackParamList = {
    NotesList: {
        userData: {
            Course: string;
            Branch: string;
            Sem: string;
        };
        notesData: any;
        selected: string;
        subject: string;
    };
};
type MyStackParamList = {
    NotesList: {
        userData: {
            Course: string;
            Branch: string;
            Sem: string;
        };
        notesData: string;
        selected: string;
        subject: string;
    };
    PdfViewer: {
        userData: {
            Course: string;
            Branch: string;
            Sem: string;
        };
        notesData: string;
        selected: string;
        subject: string;
    };
    UploadScreen: {
        userData: {
            Course: string;
            Branch: string;
            Sem: string;
        };
        notesData: string;
        selected: string;
        subject: string;
    };
};

type pdfViewer = StackNavigationProp<MyStackParamList, 'PdfViewer'>;

function remove(filename: string) {
    if (filename.endsWith(".pdf")) {
        filename = filename.slice(0, -4);
        if (filename.length > 15) {
            return filename.substring(0, 20);
        }
        return filename;
    }
}

const NewRequestCard = ({ item, index, selected, subject }: any) => {
    const { isOpen, onOpen, onClose } = useDisclose();
    const theme = useSelector((state: any) => state.theme);
    const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
    const navigation = useNavigation<pdfViewer>();
    const dispatch: any = useDispatch();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [ratingCount, setRatingCount] = useState(0);
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);
    const userFirestoreData = useSelector((state: any) => state.usersData);
    const [submitted, setSubmitted] = useState(false);
    const path = (item.path).split("/");
    const [downloadUrl, setDownloadUrl] = useState("");

    const getDownloadUrl = async (filePath: any) => {
        try {
            const reference = storage().ref(filePath);
            const downloadUrl = await reference.getDownloadURL();
            setDownloadUrl(downloadUrl);
        } catch (error) {
            console.error('Error retrieving download URL:', error);
        }
    };
    useEffect(() => {
        getDownloadUrl(item.path);
    }, []);

    return (
        <View style={styles.notesContainer}>
            <View style={styles.reccomendationStyle}>
                <TouchableOpacity
                    style={styles.subjectContainer}
                    onPress={() => {
                        NavigationService.navigate('UserRequestsPdfViewer', {
                            item: downloadUrl,
                        });
                    }}>
                    <View style={styles.containerBox}>
                        <View style={styles.containerText}>

                        </View>
                    </View>
                    <View
                        style={{
                            width: '65%',
                            height: '90%',
                            justifyContent: 'space-evenly',
                            alignItems: 'flex-start',
                            paddingTop: theme.sizes.height * 0.01,
                            paddingLeft: theme.sizes.width * 0.02,
                        }}>
                        <Text style={styles.subjectName}>
                            {/* {remove(item?.name)} */}
                            {(subject)?.substring(0, 20)}
                        </Text>
                        <Text
                            style={{
                                fontSize: theme.sizes.subtitle,
                                color: theme.colors.primaryText,
                                fontWeight: '400',
                            }}>
                            {(item?.selected).charAt(0).toUpperCase() + (item?.selected).slice(1)}
                        </Text>
                        <Text
                            style={{
                                fontSize: theme.sizes.subtitle,
                                color: item.units === "" ? theme.colors.textSecondary : theme.colors.primaryText,
                                fontWeight: '400',
                            }}>
                            {item?.units === "" ? "Units: Unknown" : item?.units + " Units"}
                        </Text>
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingRight: theme.sizes.width * 0.02,
                                maxWidth: '100%',
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Text style={{
                                    fontSize: theme.sizes.subtitle,
                                    color: theme.colors.primaryText,
                                    fontWeight: '600',
                                }}>|</Text>
                                <Text
                                    style={{
                                        fontSize: theme.sizes.subtitle,
                                        color: theme.colors.primaryText,
                                        fontWeight: '600',
                                        paddingHorizontal: theme.sizes.width * 0.01,
                                    }}>
                                    {path[0]}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <Text style={{
                                    fontSize: theme.sizes.subtitle,
                                    color: theme.colors.primaryText,
                                    fontWeight: '600',
                                }}>|</Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: item.rating < 1 ? theme.colors.textSecondary : theme.colors.primaryText,
                                        fontWeight: '600',
                                        paddingHorizontal: theme.sizes.width * 0.01,
                                    }}>
                                    {path[1]}
                                </Text>
                                <Text style={{
                                    fontSize: theme.sizes.subtitle,
                                    color: theme.colors.primaryText,
                                    fontWeight: '600',
                                }}>|</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: theme.colors.textSecondary,
                                        fontWeight: '400',
                                        alignItems: 'center',
                                        paddingHorizontal: theme.sizes.width * 0.01,
                                    }}>
                                    {path[2]}
                                </Text>
                                <Text style={{
                                    fontSize: theme.sizes.subtitle,
                                    color: theme.colors.primaryText,
                                    fontWeight: '600',
                                }}>|</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: theme.colors.textSecondary,
                                        fontWeight: '400',
                                        alignItems: 'center',
                                        paddingHorizontal: theme.sizes.width * 0.01,
                                    }}>
                                    Sem: {path[3]}
                                </Text>
                                <Text style={{
                                    fontSize: theme.sizes.subtitle,
                                    color: theme.colors.primaryText,
                                    fontWeight: '600',
                                }}>|</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.cardOptions}>
                <TouchableOpacity style={[styles.cardOptionContainer, {
                    backgroundColor: theme.colors.greenSuccess,
                    padding: 8,
                    borderRadius: 5,
                }]} >
                    <Text style={styles.cardOptionText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    console.log("Reject");
                    dispatch(UserRequestsActions.rejectRequest(index));
                }} style={[styles.cardOptionContainer, {
                    backgroundColor: theme.colors.redError,
                    padding: 8,
                    borderRadius: 5,
                }]} >
                    <Text style={styles.cardOptionText}>Disapprove</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cardOptionContainer, {
                    backgroundColor: theme.colors.primary,
                    padding: 8,
                    borderRadius: 5,
                }]} >
                    <Text style={styles.cardOptionText}>Contact</Text>
                </TouchableOpacity>
            </View>
            <Modal isOpen={modalVisible} onClose={setModalVisible} size={'xl'}>
                <Modal.Content >
                    <Box margin={2} >
                        <Text fontSize={'14px'} fontWeight={'700'} marginTop={3} textAlign="center" >
                            How likely are you to recommend this resources to your friends/colleagues?
                        </Text>
                        <Stack direction="row" space={2} marginY={10} alignItems="center" justifyContent="center" >
                            <SwipeableRating
                                rating={ratingCount}
                                size={theme.sizes.height * 0.05}
                                gap={theme.sizes.width * 0.02}
                                onPress={(rating: any) => {
                                    setRatingCount(rating)
                                }}
                                swipeable={true}
                                color={theme.colors.yellowWarning}
                                emptyColor={theme.colors.textSecondary}
                                maxRating={5}
                                allowHalves={true}
                                style={{
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            />
                        </Stack>
                        <Stack direction="row" space={2} marginY={5} alignItems="center" justifyContent="space-evenly" >
                            <TouchableOpacity onPress={() => {
                                setModalVisible(false);
                            }} >
                                <Text fontSize={theme.sizes.subtitle} fontWeight={'700'} textAlign="center" color={theme.colors.textSecondary} >
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                backgroundColor: theme.colors.primary,
                                borderRadius: 10,
                                paddingHorizontal: theme.sizes.width * 0.06,
                                paddingVertical: 10,
                            }} onPress={() => {
                                setModalVisible(false);
                            }} >
                                <Text fontSize={theme.sizes.subtitle} fontWeight={'700'} textAlign="center" color={"#FFF"} onPress={() => {
                                }} >
                                    Confirm
                                </Text>
                            </TouchableOpacity>

                        </Stack>
                    </Box>
                </Modal.Content>
            </Modal>
            <Center>
                <Actionsheet isOpen={isOpen} onClose={onClose} borderRadius={0}>
                    {
                        !submitted ? (
                            <Card style={{
                                backgroundColor: "#FFF",
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                            }}>
                                <ReportIconBlack />
                                <Box w="100%" h={theme.sizes.height * 0.1} px={4} my={4} justifyContent="center" alignItems={"center"} >
                                    <Text fontSize={theme.sizes.subtitle} color={theme.colors.primaryText} fontWeight={700} >
                                        Why are you reporting this resource?
                                    </Text>
                                    <Text fontSize={theme.sizes.textSmall} color="#91919F" textAlign={"center"} fontWeight={700} >
                                        Your report is anonymous, except if you are reporting an intellectual property infringement
                                    </Text>
                                </Box>
                                <Box w="100%" px={0} my={4} justifyContent="center" alignItems={"center"} >
                                    <Actionsheet.Item style={{
                                        borderBottomWidth: 0.9,
                                        borderBottomColor: theme.colors.textSecondary,
                                        backgroundColor: theme.colors.quaternary,
                                    }} onPress={() => {
                                        setChecked1(!checked1);
                                    }}>
                                        <Checkbox _android={{
                                            _checked: {
                                                bg: theme.colors.primary,
                                                borderColor: theme.colors.primary,
                                                color: theme.colors.quaternary,
                                            },
                                            _unchecked: {
                                                bg: theme.colors.quaternary,
                                                borderColor: theme.colors.primary,
                                                color: theme.colors.primary,
                                            },
                                        }} onChange={(value) => {
                                            setChecked1(!checked1);
                                        }} value={"Checked 1"} colorScheme="green" >
                                            <Text fontSize={theme.sizes.subtitle} color={theme.colors.primaryText} fontWeight={700} paddingLeft={4} width={'95%'} >
                                                Copyrights: The notes or this resource file contain copyrighted material
                                            </Text>
                                        </Checkbox>
                                    </Actionsheet.Item>
                                    <Actionsheet.Item style={{
                                        borderBottomWidth: 0.9,
                                        borderBottomColor: "#91919F",
                                        backgroundColor: "#FFF",
                                    }} onPress={() => {
                                        setChecked2(!checked2);
                                    }}>
                                        <Checkbox _android={{
                                            _checked: {
                                                bg: theme.colors.primary,
                                                borderColor: theme.colors.primary,
                                                color: theme.colors.quaternary,
                                            },
                                            _unchecked: {
                                                bg: theme.colors.quaternary,
                                                borderColor: theme.colors.primary,
                                                color: theme.colors.primary,
                                            },
                                        }} onChange={(value) => {
                                            setChecked2(!checked2);
                                        }} value={"Checked 1"} colorScheme="green" >
                                            <Text fontSize={theme.sizes.subtitle} color={theme.colors.primaryText} fontWeight={700} paddingLeft={4} width={'95%'} >
                                                Misleading resource: The uploaded source contains inaccurate and false information.
                                            </Text>
                                        </Checkbox>
                                    </Actionsheet.Item>
                                    <Actionsheet.Item style={{
                                        borderBottomWidth: 0.9,
                                        borderBottomColor: "#91919F",
                                        backgroundColor: "#FFF",
                                    }} onPress={() => {
                                        setChecked3(!checked3);
                                    }}>
                                        <Checkbox
                                            _android={{
                                                _checked: {
                                                    bg: theme.colors.primary,
                                                    borderColor: theme.colors.primary,
                                                    color: theme.colors.quaternary,
                                                },
                                                _unchecked: {
                                                    bg: theme.colors.quaternary,
                                                    borderColor: theme.colors.primary,
                                                    color: theme.colors.primary,
                                                },
                                            }}
                                            onChange={(value) => {
                                                setChecked3(!checked3);
                                            }} value={"Checked 1"} colorScheme="green" >
                                            <Text fontSize={theme.sizes.subtitle} color={theme.colors.primaryText} fontWeight={700} paddingLeft={4} width={"92%"}>
                                                Spam: This file contains content other than notes and resources.
                                            </Text>
                                        </Checkbox>
                                    </Actionsheet.Item>
                                </Box>
                                <Box w="100%" h={theme.sizes.height * 0.08} px={4} my={0} justifyContent="center" alignItems={"center"} >
                                    <Text fontSize={theme.sizes.subtitle} mt={-6} color={theme.colors.primary} fontWeight={700} onPress={() => {
                                    }} >
                                        Reason not listed here? Write to Us
                                    </Text>
                                </Box>
                                <Stack direction="row" space={2} marginY={0} paddingX={5} alignItems="center" justifyContent="space-evenly" width={"100%"} >
                                    <TouchableOpacity onPress={onClose} >
                                        <Text fontSize={theme.sizes.subtitle} fontWeight={'700'} textAlign="center" color={theme.colors.textSecondary} >
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        backgroundColor: theme.colors.primary,
                                        borderRadius: 10,
                                        paddingHorizontal: theme.sizes.width * 0.05,
                                        paddingVertical: 10,
                                    }} onPress={() => { }} >
                                        <Text fontSize={theme.sizes.title} fontWeight={'700'} textAlign="center" color={theme.colors.quaternary} >
                                            Confirm
                                        </Text>
                                    </TouchableOpacity>
                                </Stack>
                                <Ionicons name="close-circle" size={theme.sizes.height * 0.05} onPress={onClose} color="#BCC4CC" style={{
                                    position: "absolute",
                                    top: 15,
                                    right: 15,
                                }} />
                            </Card>
                        ) : (
                            <Card style={{
                                height: 400,
                                backgroundColor: theme.colors.quaternary,
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                            }} >
                                <AntDesign name="checkcircle" size={50} color={theme.colors.primary} />
                                <Box w="100%" h={theme.sizes.height * 0.1} px={4} my={4} justifyContent="center" alignItems={"center"} marginBottom={20} >
                                    <Text fontSize={theme.sizes.title} color={theme.colors.primaryText} fontWeight={700} >
                                        Thank you for letting us know!
                                    </Text>
                                    <Text fontSize={theme.sizes.subtitle} padding={theme.sizes.height * 0.01} paddingTop={theme.sizes.height * 0.01} color={theme.colors.textSecondary} textAlign={"center"} fontWeight={700} >
                                        We will review your report and take appropriate action.
                                    </Text>
                                </Box>
                                <TouchableOpacity style={{
                                    backgroundColor: theme.colors.primary,
                                    borderRadius: 10,
                                    width: "100%",
                                    paddingVertical: theme.sizes.height * 0.02,
                                    marginVertical: theme.sizes.height * 0.02,
                                    position: "absolute",
                                    height: theme.sizes.height * 0.07,
                                    bottom: 0,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }} onPress={() => {
                                    onClose();
                                }} >
                                    <Text fontSize={theme.sizes.title} fontWeight={'700'} textAlign="center" color={theme.colors.quaternary} >
                                        Close
                                    </Text>
                                </TouchableOpacity>
                                <Ionicons name="close-circle" size={30} onPress={onClose} color="#BCC4CC" style={{
                                    position: "absolute",
                                    top: 15,
                                    right: 15,
                                }} />
                            </Card>
                        )
                    }
                </Actionsheet>
            </Center>
        </View >
    );
};

export default NewRequestCard;

const styles = StyleSheet.create({});
