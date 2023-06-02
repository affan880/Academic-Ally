import { Actionsheet, Box, Card, Center, Checkbox, Divider, Icon, IconButton, Popover, Stack, Text, Toast, useDisclose, View, VStack } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Linking, Share, TouchableOpacity } from 'react-native'
import RNFS from 'react-native-fs'
import Pdf from 'react-native-pdf'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux'

import NavigationLayout from '../../interfaces/navigationLayout'
import ReportActionSheet from '../../sections/NotesCard/Report/ReportActionSheet'
import { userFirestoreData } from '../../services/fetch'
import NavigationService from '../../services/NavigationService'
import PdfViewerAction from '../Notes/PdfViewer/pdfViewerAction'

const DownloadScreen = () => {
  const dynamicLink = useSelector((state: any) => state?.bootReducer?.utilis?.dynamicLink);
  const dispatch = useDispatch()
  const [pdfs, setPdfs] = useState([])
  const [files, setFiles] = useState([])
  const [data, setData] = useState([])

  const theme = useSelector((state: any) => state.theme);
  const size = theme?.sizes;
  const colors = theme?.colors;

  const getDownloadedList = async () => {
    await PdfViewerAction.listDownloadedFiles().then((res: any) => {
      setData(res);
      const filterFiles = res.filter((item: any) => item.endsWith('.text'))
      setFiles(filterFiles)
    })
  }

  useEffect(() => {
    getDownloadedList()
  }, [])

  useEffect(() => {
    if (data.length > 0 && files.length > 0) {
      PdfViewerAction.getfileMetaData(files).then((res: any) => {
        setPdfs(res)
      })
    }
  }, [files])

  const PdfPreviewComponent = ({ notesData, index }: any) => {
    const { isOpen, onOpen, onClose } = useDisclose();
    const data = notesData
    const initialFocusRef = React.useRef(null);
    const pdfFileName = `${notesData?.name}_${notesData?.branch}_${notesData?.sem}.pdf`
    const filePath = `${RNFS.DocumentDirectoryPath}/Resources/${pdfFileName}`;
    const source: object = {
      uri: filePath,
      cache: true,
      expiration: 0,
    };
    return (
      <>
        <Card width={size.width * 0.85} height={size.height * 0.25} bgColor={colors.primary} borderRadius={20} marginY={3} p={0}  >
          <TouchableOpacity style={{
            width: '100%',
            height: '70%',
            borderRadius: 20,
          }}
            onPress={() => {
              NavigationService.navigate(NavigationService.screens.PdfViewer, {
                userData: {},
                notesData: notesData,
                selected: notesData?.category,
                subject: notesData?.subject,
              });
            }}
          >
            <Box width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'} backgroundColor={colors.white} borderTopRadius={20} >
              <Pdf
                trustAllCerts={false}
                source={source}
                scale={3.5}
                minScale={0.5}
                maxScale={5.0}
                spacing={10}
                enableRTL={true}
                singlePage={true}
                enableAnnotationRendering={true}
                page={1}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: colors.terinaryText,
                }}
              />
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }} />
            </Box>
          </TouchableOpacity>

          <Box width={'100%'} height={'30%'} justifyContent={'flex-start'} borderTopRadius={20} flexDirection={'row'} p={4} >
            <Box width={'90%'} height={'100%'} flexDirection={'column'} >
              <Box width={'100%'} flexDirection={'row'} pb={1}>
                <Text width={'50%'} color={colors.white} fontSize={size.textMidTiny} fontWeight={'bold'} >{(notesData?.subject)?.slice(0, 20)}</Text>
                <Text width={'25%'} color={colors.white} fontSize={size.textMidTiny} fontWeight={'bold'}>Branch: {notesData?.branch}</Text>
                <Text width={'25%'} color={colors.white} fontSize={size.textMidTiny} fontWeight={'bold'}>Sem: {notesData?.sem}</Text>
              </Box>
              <Box width={'100%'} flexDirection={'row'} >
                <Text width={'50%'} color={colors.white} fontSize={size.textMidTiny} >{(notesData?.name)?.slice(0, 20)}</Text>
                <Text width={'40%'} color={colors.white} fontSize={size.textMidTiny} >{notesData?.category}</Text>
              </Box>
            </Box>
            <Box width={'10%'} height={'100%'} justifyContent={'center'} alignItems={'flex-end'} >
              <Box w="100%" alignItems="center">
                <Popover initialFocusRef={initialFocusRef}
                  placement={'left'} trigger={triggerProps => {
                    return <IconButton
                      rounded={true}
                      _hover={{
                        bg: 'rgba(0, 0, 0, 0.1)'
                      }}
                      ref={initialFocusRef}
                      variant="ghost"
                      icon={<Icon as={Feather} name="more-vertical" size="xl" color="white" />}
                      {...triggerProps}
                    />
                  }}>
                  <Popover.Content width={size.width * 0.32} p={0} >
                    <Popover.Body p={0} backgroundColor={colors.popOver} >
                      <TouchableOpacity style={{
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        paddingVertical: 8,
                        flexDirection: 'row',
                      }}
                        onPress={async () => {
                          try {
                            await PdfViewerAction.deleteFile(notesData).then((res: any) => {
                              getDownloadedList()
                              Toast.show({
                                title: 'Deleted Successfully',
                                placement: 'bottom',
                                duration: 3000,
                              })
                            }).catch((error: any) => {
                              Toast.show({
                                title: 'Something went wrong',
                                placement: 'bottom',
                                duration: 3000,
                              })
                            })
                          } catch (error) {
                            Toast.show({
                              title: 'Something went wrong',
                              placement: 'bottom',
                              duration: 3000,
                            })
                          }
                        }}
                      >
                        <Text color={colors.primaryText} fontSize={size.textMedium} fontWeight={'bold'} >Delete</Text>
                        <Icon as={<AntDesign name="delete" />} color={colors.primaryText} size={22} />
                      </TouchableOpacity>
                      <Divider width={'100%'} />
                      <TouchableOpacity style={{
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        paddingVertical: 6,
                        flexDirection: 'row',
                      }}
                        onPress={async () => {
                          try {
                            await PdfViewerAction.sharePdf(notesData, dynamicLink).then((link: any) => {
                              Share.share({
                                title: `${notesData?.subject}`,
                                message: `If you're studying ${notesData?.subject}, you might find these ${notesData.category} on Academic Ally helpfull. I did! Check them out:${link}`
                              });
                            }).catch((error: any) => {
                              Toast.show({
                                title: 'Something went wrong',
                                placement: 'bottom',
                                duration: 3000,
                              })
                            })
                          } catch (error) {
                            Toast.show({
                              title: 'Something went wrong',
                              placement: 'bottom',
                              duration: 3000,
                            })
                          }
                        }}
                      >
                        <Text color={colors.primaryText} fontSize={size.textMedium} fontWeight={'bold'} >Share</Text>
                        <Icon as={<colors.shareIcon />} color={colors.primaryText} size="md" />
                      </TouchableOpacity>
                      <Divider width={'100%'} />
                      <TouchableOpacity style={{
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        paddingVertical: 6,
                        flexDirection: 'row',
                      }}
                        onPress={() => {
                          onOpen();
                        }}
                      >
                        <Text color={colors.primaryText} fontSize={size.textMedium} fontWeight={'bold'} >Report</Text>
                        <Icon as={<colors.reportIcon />} color={colors.primaryText} size="md" />
                      </TouchableOpacity>
                    </Popover.Body>
                  </Popover.Content>
                </Popover>
              </Box>
            </Box>
          </Box>
          <ReportActionSheet isOpen={isOpen} onClose={onClose} notesData={data} />
        </Card>
      </>
    )

  }
  return (
    <NavigationLayout rightIconFalse={true} title={'Downloads'} handleScroll={() => { }} >
      <Box justifyContent={'center'} alignItems={'center'} >
        {
          pdfs.length > 0 && pdfs.map((item, index) => {
            return <PdfPreviewComponent notesData={item} key={index} />
          })
        }
      </Box>
    </NavigationLayout>
  )
}

export default DownloadScreen