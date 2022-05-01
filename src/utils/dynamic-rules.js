let bi = 3, si = 38

const dynRules = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '',
  '0',
  '01',
  '012',
  '0123',
  '01234',
  '012345',
  '0123456',
  '01234567',
  '012345678',
  '12345678',
  '2345678',
  '345678',
  '45678',
  '5678',
  '678',
  '78',
  '8',
  '1',
  '12',
  '123',
  '1234',
  '12345',
  '123456',
  '1234567',
  '12345678',
  '',
  '01',
  '12',
  '23',
  '34',
  '45',
  '56',
  '67',
  '78',
  '80',
  '',
  '02',
  '13',
  '24',
  '35',
  '46',
  '57',
  '68',
  '70',
  '',
  '012',
  '123',
  '234',
  '345',
  '456',
  '567',
  '678',
  '780',
  '801',
  '',
  '0123',
  '1234',
  '2345',
  '3456',
  '4567',
  '5678',
  '6780',
  '7801',
  '8012',
  '',
  '01234',
  '12345',
  '23456',
  '34567',
  '45678',
  '56780',
  '67801',
  '78012',
  '80123',
  ''
]

const currBRl = () => dynRules[bi]
const currSRl = () => dynRules[si]

const nextBRl = () => {
  if (bi < dynRules.length - 1) {
    bi += 1
  } else {
    bi = 0
  }
  return dynRules[bi]
}

const prevBRl = () => {
  if (bi > 0) {
    bi -= 1
  } else {
    bi = dynRules.length - 1
  }
  return dynRules[bi]
}

const nextSRl = () => {
  if (si < dynRules.length - 1) {
    si += 1
  } else {
    si = 0
  }
  return dynRules[si]
}

const prevSRl = () => {
  if (si > 0) {
    si -= 1
  } else {
    si = dynRules.length - 1
  }
  return dynRules[si]
}

export { currBRl, currSRl, nextBRl, prevBRl, nextSRl, prevSRl }