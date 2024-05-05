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

const cmbrPanelsAtom = atom({ index: 0 })
export const useCmbrPanelsAtom = () => {
  return useAtom(cmbrPanelsAtom)
}
