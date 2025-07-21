import SequelizeMock from 'sequelize-mock';

const DBConnectionMock = new SequelizeMock();

const PetMock = DBConnectionMock.define('Pet', {
  id: 1,
  name: 'Buddy',
  type: 'Dog',
  age: 3
});

describe('Pet Model', () => {
  it('should create a Pet', async () => {
    const pet = await PetMock.create({
      name: 'Buddy',
      type: 'Dog',
      age: 3
    });
    expect(pet.name).toBe('Buddy');
    expect(pet.type).toBe('Dog');
    expect(pet.age).toBe(3);
  });
}); 