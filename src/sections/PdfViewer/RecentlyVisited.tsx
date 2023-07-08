import { Actionsheet, Box, HStack, Icon, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';

import { userClearRecents, userRemoveFromRecents } from '../../redux/reducers/usersRecentPdfsManager';
import NavigationService from '../../services/NavigationService';
import UtilityService from '../../services/UtilityService';

type Props = {
    userData: any;
    notesData: any
    toggleOpen: any;
    toggleClose: any
}

const RecentlyVisited = ({ toggleOpen, toggleClose, userData, notesData }: Props) => {
    const dispatch: any = useDispatch()
    const [userRecents, setUserRecents] = useState<any>([]);
    const recentsList = useSelector((state: any) => state.userRecentPdfs.RecentViews);
    const theme = useSelector((state: any) => state.theme);

    useEffect(() => {
        setUserRecents(recentsList);
    }, [recentsList]);


    return (
        <Actionsheet isOpen={toggleOpen} onClose={toggleClose}
            _backdrop={{
                backgroundColor: theme.colors.primary
            }} >
            <Actionsheet.Content style={{
                backgroundColor: theme.colors.actionSheet
            }}>
                <HStack w="100%" h={60} px={4} justifyContent="space-between">
                    <Text fontSize="16" color="gray.500">
                        Recents
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            dispatch(userClearRecents([]));
                            toggleClose();
                        }}>
                        <Text fontSize="12" color={theme.colors.primaryText}>
                            Clear
                        </Text>
                    </TouchableOpacity>
                </HStack>
                {userRecents?.length > 0 ? (
                    userRecents.map((item: any, index: any) => {
                        return (
                            <Actionsheet.Item
                                key={index}
                                width={'100%'}
                                paddingTop={5}
                                style={{
                                    backgroundColor: theme.colors.actionSheet
                                }}
                                onPress={() => {
                                    NavigationService.replace(NavigationService.screens.PdfViewer, {
                                        userData: userData,
                                        notesData: item,
                                        selected: notesData.category,
                                        subject: notesData.subject,
                                    });
                                    toggleClose();
                                }}>
                                <Box
                                    flexDirection={'row'}
                                    width={'100%'}
                                    justifyContent={'space-between'}>
                                    <Text textAlign={'left'} width={'90%'} color={theme.colors.primaryText} >
                                        {UtilityService.removeString(item.name)}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            dispatch(userRemoveFromRecents(item));
                                        }}>
                                        <Icon
                                            as={Entypo}
                                            name="cross"
                                            size="md"
                                            color="gray.400"
                                        />
                                    </TouchableOpacity>
                                </Box>
                            </Actionsheet.Item>
                        );
                    })
                ) : (
                    <Text>No Recents</Text>
                )}
            </Actionsheet.Content>
        </Actionsheet>
    )
}

export default RecentlyVisited