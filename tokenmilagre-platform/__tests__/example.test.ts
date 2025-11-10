/**
 * Teste exemplo para validar configuração do Jest
 */

describe('Jest Setup', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true)
  })

  it('should perform basic arithmetic', () => {
    expect(1 + 1).toBe(2)
    expect(5 - 2).toBe(3)
  })

  it('should handle arrays', () => {
    const arr = [1, 2, 3]
    expect(arr).toHaveLength(3)
    expect(arr).toContain(2)
  })

  it('should handle objects', () => {
    const obj = { name: 'Token Milagre', type: 'platform' }
    expect(obj).toHaveProperty('name')
    expect(obj.name).toBe('Token Milagre')
  })
})
