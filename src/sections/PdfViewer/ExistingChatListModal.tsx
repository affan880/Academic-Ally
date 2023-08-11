import { formatDistanceToNow } from 'date-fns';
import { Box, Center, CloseIcon, Divider, HStack, Icon, IconButton, Modal, Text, VStack, Wrap } from 'native-base'
import React, { useEffect, useMemo, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import RNFS from 'react-native-fs';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'

import AllyBotActions from '../../screens/AllyBot/AllyBotActions';
import UtilityService from '../../services/UtilityService';
import createStyles from './styles';

type Props = {
    existingChatList : any
    open: any,
    close: any,
    handleAddNewChat: any,
    setDocId:any
}

const ExistingChatList = React.memo(({existingChatList, open, close, handleAddNewChat, setDocId}: Props) => {
  
  const theme = useSelector((state: any) => { return state.theme; });
  const {uid}: any = useSelector((state: any) => state.bootReducer.userInfo);
  
  return (
    <Modal isOpen={open} onClose={close} size={'sm'}>
      <Modal.Content size={'sm'} backgroundColor={theme.colors.quaternary} >
        <ScrollView showsVerticalScrollIndicator={false} style={{
            marginHorizontal: 6,
            marginTop: 4
        }}>
        {/* <Icon as={Ionicons} name="close-outline" alignSelf={'flex-end'} onPress={()=>{close()}}  size="2xl" color={theme.colors.terinaryText} /> */}
        <Box>
        {
            existingChatList.map((item : any, index: string)=>{
                return (
                    <TouchableOpacity
                    onPress={()=>{
                      setDocId(item.docId)
                    }}
                    key={index}
                      style={{
                        alignItems: 'center',
                        justifyContent:'space-between',
                        width: '100%',
                        height: 50,
                        backgroundColor: theme.colors.tertiary,
                        alignSelf: 'center',
                        borderRadius: 10,
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                        marginVertical: 5
                      }}
                    >
                      <Box flexDirection={'row'}>
                      <Icon as={Ionicons} name="chatbox-outline" size="md" color={theme.colors.white} />
                      <Text fontWeight={600} fontSize={'md'} color={theme.colors.white} paddingX={2} >
                        {/* {capitalizeFirstLetter((UtilityService.removeString(item?.name)).slice(0, 20).toLowerCase()) + '....'}  */}
                        {UtilityService.formatDate(item.date, 'dd MMM hh:mm')}
                      </Text>
                      </Box>
                      
                      <IconButton
                        borderRadius={'full'}
                        _hover={{
                            bg: theme.colors.primary,
                        }}
                        variant="ghost"
                        icon={<Icon as={AntDesign} name="delete" size="md" color={theme.colors.white} />}
                        onPress={() => {
                          AllyBotActions.deleteChat(uid, item.docId)
                        }}
                    />
                    </TouchableOpacity>
                )
            })
        }
        </Box>
        </ScrollView>
            <TouchableOpacity
            onPress={handleAddNewChat}
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                height: 50,
                backgroundColor: theme.colors.mainTheme,
                alignSelf: 'center',
                flexDirection: 'row',
                paddingHorizontal: 15,
              }}
            >
              <Text color={theme.colors.white} fontSize={'md'} fontWeight={'bold'}>
                New chat
              </Text>
                <Icon as={Ionicons} name="ios-add-sharp" size="2xl" color={theme.colors.white} />
            </TouchableOpacity>
    </Modal.Content>
  </Modal>
  )
});

export default ExistingChatList
