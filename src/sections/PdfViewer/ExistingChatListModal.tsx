import { Box, Center, CloseIcon, Divider, HStack, Icon, IconButton, Modal, Text, VStack, Wrap } from 'native-base'
import { PDFDocument } from 'pdf-lib'
import React, { useEffect, useMemo, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import RNFS from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'

import UtilityService from '../../services/UtilityService';
import createStyles from './styles';

type Props = {
    existingChatList : any
    open: any,
    close: any,
    handleAddNewChat: any
}

const ExistingChatList = ({existingChatList, open, close, handleAddNewChat}: Props) => {
  const [totalPages, setTotalPages] = useState<any>([])
  const [fromPage, setFromPage] = useState('')
  const [toPage, setToPage] = useState('')
  
  const theme = useSelector((state: any) => { return state.theme; });
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  return (
      <Modal isOpen={open} onClose={close} size={'sm'}>
    <Modal.Content size={'sm'}>
        <Icon as={Ionicons} name="close-outline" alignSelf={'flex-end'} onPress={()=>{
            close();
        }}  size="2xl" color={theme.colors.terinaryText} margin={1} />
        <ScrollView showsVerticalScrollIndicator={false} style={{
            margin: 10
        }}>
        <Box>
        {
            existingChatList.map((item : any, index: string)=>{
                return (
                    <TouchableOpacity
                    key={index}
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        height: 50,
                        backgroundColor: theme.colors.mainTheme,
                        alignSelf: 'center',
                        borderRadius: 10,
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                        marginVertical: 5
                      }}
                    >
                      <Text color={theme.colors.white} fontSize={'md'} fontWeight={'bold'}>
                        {
                            (item?.conversation).length === 0 ? 
                            UtilityService.formatDate(item.date, 'dd MMM hh:mm') : ((item?.conversation)[0].prompt).slice(0,15)
                        }
                      </Text>
                        <Icon as={Ionicons} name="chevron-forward-outline" size="2xl" color={theme.colors.white} />
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
}

export default ExistingChatList
