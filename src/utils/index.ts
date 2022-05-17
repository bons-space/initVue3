export const formatDate = (time: number) => {
  const addZero = (m: number) => (m < 10 ? `0${m}` : m);
  if ((`${time}`).length === 10) {
    time *= 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  return (
    `${d.getFullYear()}.${addZero(d.getMonth() + 1)}.${addZero(d.getDate())}`
  );
};

export const formatDate2 = (time: number) => {
  const addZero = (m: number) => (m < 10 ? `0${m}` : m);
  if ((`${time}`).length === 10) {
    time *= 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  return (
    `${d.getFullYear()}-${addZero(d.getMonth() + 1)}-${addZero(d.getDate())}`
  );
};

export function formatTime(time: number) {
  const addZero = (m: number) => (m < 10 ? `0${m}` : m);
  if ((`${time}`).length === 10) {
    time *= 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  return (
    `${d.getFullYear()}-${addZero(d.getMonth() + 1)}-${addZero(d.getDate())} ${addZero(d.getHours())}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())}`
  );
}

export function formatMinute(time: number) {
  const addZero = (m: number) => (m < 10 ? `0${m}` : m);
  if ((`${time}`).length === 10) {
    time *= 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  return (
    `${d.getFullYear()}.${addZero(d.getMonth() + 1)}.${addZero(d.getDate())} ${addZero(d.getHours())}:${addZero(d.getMinutes())}`
  );
}

export const msgCopy = (value: string) => {
  if (!value) {
    alert('无复制内容');
    return;
  }
  // 动态创建 textarea 标签
  const textarea = document.createElement('textarea');
  // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
  textarea.readOnly = true;
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  // 将要 copy 的值赋给 textarea 标签的 value 属性
  textarea.value = value;
  // 将 textarea 插入到 body 中
  document.body.appendChild(textarea);
  // 选中值并复制
  textarea.select();
  // textarea.setSelectionRange(0, textarea.value.length);
  const result = document.execCommand('Copy');
  if (result) {
    alert('无复制内容');
  }
  document.body.removeChild(textarea);
};
