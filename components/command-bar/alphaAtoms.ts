import { atom } from 'jotai'

export const cmbOpenAtom = atom(true)
cmbOpenAtom.debugLabel = 'commandBarOpenAtom'

export const cmbHeightAtom = atom(474)
cmbHeightAtom.debugLabel = 'cmbHeightAtom'

export const cmbTotalHeightAtom = atom(85)
cmbTotalHeightAtom.debugLabel = 'cmbTotalHeightAtom'
