import { formatDistanceToNow } from 'date-fns';
import { Box, Divider, Text } from 'native-base'
import React, { useEffect, useMemo, useState } from 'react'
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import MainScreenLayout from '../../layouts/mainScreenLayout'
import AllyChatBot from '../../sections/PdfViewer/AllyChatBot/AllyChatBot'
import UtilityService from '../../services/UtilityService'
import AllyBotActions from './AllyBotActions'

type Props = {}

const AllyBotScreen = (props: Props) => {
  const {uid}: any = useSelector((state: any)=> state.bootReducer.userInfo);
  const theme = useSelector((state: any) => state.theme);
  const dispatch: any = useDispatch<any>()
  const InitiatedChats = useSelector((state: any)=> state.AllyBotReducer.initiatedChatsList)
  const [openAllyBot, setOpenAllyBot] = useState(false)
  const [choosenDoc, setchoosenDoc] = useState(null)
  const [docId, setDocId] = useState(null)
  useEffect(()=>{
    dispatch(AllyBotActions.loadInitiatedChats(uid));
  },[])
  const getTimeAgo = (date1: any, date2: any) => {
    const timeDifference = Math.abs(date1 - date2);
    return formatDistanceToNow(date1, { addSuffix: true });
  };

  const renderItems = (item: any, index: any) => {
    return (
      <>
        <TouchableOpacity key={index} style={{ padding: 10, flexDirection: 'row', width: theme.sizes.width, justifyContent:'space-between', borderRadius: 15, marginHorizontal:5, marginVertical: 7 }} 
        onPress={()=>{
          setDocId(item.docId);
          setchoosenDoc(item);
          setOpenAllyBot(true)
        }}  >
            <Box width={'18%'} borderRadius={10} height={16} backgroundColor={theme.colors.tertiary} />
            <Box flexDirection={'column'} width={'80%'} justifyContent={'space-around'} paddingLeft={2.5} >
            <Box flexDirection={'row'} justifyContent={'space-between'} paddingRight={2} >
                <Text fontWeight={'bold'} >{(UtilityService.removeString(item?.name)).slice(0,20)}</Text>
                <Text color={theme.colors.terinaryText} >
                  {
                    item.lastConversation.date !== null ? (getTimeAgo(new Date(item.lastConversation.date.seconds * 1000 + item.lastConversation.date.nanoseconds / 1000000), new Date())).replace('about'," "): null
                  }
                </Text>
            </Box>
            <Box flexDirection={'row'} justifyContent={'space-between'} paddingRight={2} >
                <Text color={theme.colors.terinaryText}>{(item?.lastConversation.message).slice(0,30) + '....'}</Text>
            </Box>
            </Box>
        </TouchableOpacity>
      </>
    )
  }
  return (
    <MainScreenLayout rightIconFalse={true} title={'AllyBot'} handleScroll={() => { }} name="AllyBot" >
      <FlatList
        style={{
          marginTop: 5,
        }}
        showsVerticalScrollIndicator={false}
        data={InitiatedChats}
        renderItem={({item, index}: any) => renderItems(item, index)}
        ItemSeparatorComponent={()=>{
          return <Divider />
        }}
        ListHeaderComponent={()=>{
          return <>
             <Text margin={5} fontWeight={600} fontSize={'3xl'}  >
                Chats
              </Text>
          </>
        }}
      />{
        openAllyBot &&
      <AllyChatBot open={true} close={()=> {setOpenAllyBot(false)}} docId={docId} choosenDoc={choosenDoc} />
      }
    </MainScreenLayout>
  )
}

export default AllyBotScreen

const styles = StyleSheet.create({})