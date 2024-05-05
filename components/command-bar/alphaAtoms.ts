import { atom, useAtom } from 'jotai'

export const cmbLayoutAtom = atom({
  containerHeightPc: 85,
  panelHeight: 512,
  panelOpen: true,
  rounded: false,
})
cmbLayoutAtom.debugLabel = 'cmbLayoutAtom'

export const useCmbLayoutAtom = () => {
  return useAtom(cmbLayoutAtom)
}
