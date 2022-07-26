
const getDialogModal = (params) => {
  const dialogModal = document.createElement('div');
  dialogModal.style.position = 'fixed'
  dialogModal.style.top = '0'
  dialogModal.style.bottom = '0'
  dialogModal.style.left = '0'
  dialogModal.style.right = '0'
  dialogModal.style.display = 'flex'
  dialogModal.style.zIndex = '100000'
  dialogModal.style.background = params.background
  return dialogModal
}

// 生成dialog dom
const getDocDialogContainer = (params) => {
  const dialogContainer = document.createElement('div');
  dialogContainer.style.position = 'fixed'
  dialogContainer.style.top = params.top || 'unset'
  dialogContainer.style.bottom = params.bottom || 'unset'
  dialogContainer.style.left = params.left || 'unset'
  dialogContainer.style.right = params.right || 'unset'
  dialogContainer.style.overflow = 'hidden'
  dialogContainer.style.width = params.width || '500px'
  dialogContainer.style.height = params.height || '450px'
  dialogContainer.style.background = params.background || '#fff'
  dialogContainer.style.border = params.border || '1px solid #EDEFF2'
  dialogContainer.style.borderRadius = params.borderRadius || '6px'
  dialogContainer.onclick = (e) => {
    e.stopPropagation();
  }
  return dialogContainer
}

// 生成dialog dom
const getVideoDialogContainer = (params) => {
  const dialogContainer = document.createElement('div');
  dialogContainer.style.margin = params.margin || 'auto'
  dialogContainer.style.overflow = 'visible'
  dialogContainer.style.width = params.width || '100%'
  dialogContainer.style.height = params.height || '100%'
  dialogContainer.style.maxWidth = params.maxWidth || 'auto'
  dialogContainer.onclick = (e) => {
    e.stopPropagation();
  }
  return dialogContainer
}

const getIframeContainer = (params) => {
  const container = document.createElement('div');
  container.style.position = params.position || 'relative'
  container.style.paddingTop = params.paddingTop || '56.25%',
    container.style.overflow = params.overflow || 'hidden'

  return container
}

const getIframe = () => {
  const iframe = document.createElement('iframe')
  iframe.frameborder = '0'
  iframe.allowFullscreen = true
  iframe.scrolling = 'no'
  iframe.style.width = '100%'
  iframe.style.height = '100%'
  iframe.style.border = 0
  return iframe
}


const handleOpenInNewTab = (url = '') => {
  const params = {}
  const list1 = url.split('?')
  if (list1[1]) {

    list1[1].split('&').forEach(str => {
      const strList = str.split('=')
      params[strList[0]] = strList[1]
    })
  }

  const httpObj = new XMLHttpRequest();
  const repUrl = `https://hapi.moyincloud.com/anon/help_embed/get/html_url${params.embedId ? `?helpEmbedId=${params.embedId}` : ''}`;
  httpObj.open("GET", repUrl);
  httpObj.send();

  httpObj.onreadystatechange = (e) => {
    if(httpObj.readyState === 4 && httpObj.responseText){
      const res = JSON.parse(httpObj.responseText)
      const newWindow = window.open()
      newWindow.location.href = res.data
    }
  }
}

const useDocIframe = (url = '', params = {
  dialogModal: {},
  dialog: {}
}) => {
  if (!document) {
    throw new Error('请在浏览器中调用此方法！')
  }

  const dialogId = encodeURI(url)
  if (document.getElementById(dialogId)) {
    document.getElementById(dialogId).style.display = 'block'
  } else {
    const dialogModal = getDialogModal({
      background: params.dialogModal.background
    })
    dialogModal.id = dialogId

    const dialogContainer = getDocDialogContainer({
      top: params.dialog.top,
      bottom: params.dialog.bottom,
      left: params.dialog.left,
      right: params.dialog.right,
      width: params.dialog.width,
      maxWidth: params.dialog.maxWidth,
      height: params.dialog.height,
      background: params.dialog.background,
      border: params.dialog.border,
      borderRadius: params.dialog.borderRadius,
    })

    const headBar = document.createElement('div')
    headBar.style.display = 'flex'
    headBar.style.height = '52px'
    headBar.style.justifyContent = 'space-between'
    headBar.style.alignItems = 'center'
    headBar.style.background = '#E3E4E8'
    headBar.style.padding = '0 20px'

    const headerText = document.createElement('span')
    headerText.textContent = '帮助文档'
    headerText.style.color = '#0E1421'
    headerText.style.fontSize = '16px'
    headerText.style.lineHeight = '28px'

    const iconContainer = document.createElement('div')

    // 新窗口打开
    const openInNewTabIcon = document.createElement('img')
    openInNewTabIcon.src = 'https://webfiles.moyincloud.com/hc/sdk/assets/open-in-new-tab.svg'
    openInNewTabIcon.alt = 'open-in-new-tab'
    openInNewTabIcon.style.width = '16px'
    openInNewTabIcon.style.height = '16px'
    openInNewTabIcon.style.cursor = 'pointer'
    openInNewTabIcon.style.marginRight = '16px'
    openInNewTabIcon.onclick = (e) => {
      // const newWindow = window.open()
      // newWindow.location.href = url
      handleOpenInNewTab(url)
    }

    const closeImg = document.createElement('img')
    closeImg.src = 'https://webfiles.moyincloud.com/hc/sdk/assets/dialog-close.svg'
    closeImg.alt = 'dialog-close-img'
    closeImg.style.width = '16px'
    closeImg.style.height = '16px'
    closeImg.style.cursor = 'pointer'
    closeImg.onclick = (e) => {
      dialogModal.style.display = 'none'
    }

    iconContainer.append(openInNewTabIcon)
    iconContainer.append(closeImg)
    headBar.append(headerText)
    headBar.append(iconContainer)
    dialogContainer.append(headBar)

    const iframe = getIframe()
    iframe.src = url
    iframe.scrolling = ''
    iframe.style.height = 'calc(100% - 52px)'

    dialogContainer.append(iframe)
    dialogModal.append(dialogContainer)
    document.body.append(dialogModal)
  }
}

// 百分数转换为小数
const toPoint = (percent) => {
  let num = parseInt(percent.replace('%', ''), 10);
  num /= 100;
  return num;
}

const useVideoIframe = (url = "", params = {
  phoneMatchMediaWidth: 900,
  dialogModal: {},
  dialog: {}
}) => {
  if (!document) {
    throw new Error('请在浏览器中调用此方法！')
  }
  const dialogBgId = encodeURI(url)
  const dialogId = encodeURI("dialogContainer" + url)
  const updateDialogWidth = () => {
    if (window.innerWidth < params.phoneMatchMediaWidth) {
      params.dialog.width = '100vw'
      params.modalBg = params.dialogModal.phoneBg
      if (document.getElementById(dialogBgId)) {
        document.getElementById(dialogBgId).style.background = params.dialogModal.phoneBg
      }
      return
    } else {
      params.modalBg = params.dialogModal.defaultBg
      if (document.getElementById(dialogBgId)) {
        document.getElementById(dialogBgId).style.background = params.dialogModal.defaultBg
      }
    }
    if (window.innerWidth * 0.8 * toPoint(params.dialog.paddingTop) > window.innerHeight) {
      params.dialog.width = `${window.innerHeight / toPoint(params.dialog.paddingTop) - 10}px`
      if (document.getElementById(dialogId)) {
        document.getElementById(dialogId).style.width = `${window.innerHeight / toPoint(params.dialog.paddingTop) - 10}px`
      }
    }
  }

  if (document.getElementById(dialogId)) {
    updateDialogWidth()
    document.getElementById(dialogBgId).style.display = 'flex'
    document.getElementById(dialogBgId).onclick = (e) => {
      if (document.getElementById(dialogId)) {
        document.getElementById(dialogBgId).style.display = 'none'
      }
      window.removeEventListener('resize', updateDialogWidth)
    }
  } else {
    updateDialogWidth()
    const dialogModal = getDialogModal({
      background: params.modalBg
    })
    dialogModal.id = dialogBgId
    dialogModal.onclick = (e) => {
      if (document.getElementById(dialogId)) {
        document.getElementById(dialogBgId).remove()
      }
      window.removeEventListener('resize', updateDialogWidth)
    }
    const dialogContainer = getVideoDialogContainer({
      margin: params.dialog.margin || 'auto',
      width: params.dialog.width || '80vw',
      maxWidth: params.dialog.maxWidth || '1200px',
      height: 'auto',
    })
    dialogContainer.id = dialogId

    const iframeContainer = getIframeContainer({
      paddingTop: params.dialog.paddingTop || '56.25%',
    })

    const iframe = getIframe()
    iframe.style.position = 'absolute'
    iframe.style.top = 0
    iframe.style.left = 0
    iframe.style.border = 0
    iframe.src = url

    iframeContainer.append(iframe)
    dialogContainer.append(iframeContainer)
    dialogModal.append(dialogContainer)
    document.body.append(dialogModal)
  }

  window.addEventListener('resize', updateDialogWidth)

}

window.MoYinSDK = {
  useDocIframe,
  useVideoIframe,
}