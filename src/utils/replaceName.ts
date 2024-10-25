
export const replaceName = (str: string) => {
	return str
		.normalize('NFD')
		.toLocaleLowerCase()
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'D')
		.replace(/ /g, '-')
		.replace(/[:!@#$%^&*()?;/]/g, '');
};


export const replaceNameFile = (str: string) => {
  const lastDotIndex = str.lastIndexOf(".");
  const fileExtension = lastDotIndex !== -1 ? str.substring(lastDotIndex) : ""; 
  const fileName = lastDotIndex !== -1 ? str.substring(0, lastDotIndex) : str; 

  const cleanFileName = replaceName(fileName); 

  return `${cleanFileName}${fileExtension}`;
};
