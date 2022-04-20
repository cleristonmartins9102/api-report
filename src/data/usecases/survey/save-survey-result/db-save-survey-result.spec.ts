import { SurveyResultModel } from '../../../../domain/model/survey-result-model'
import { SaveSurveyResult, SaveSurveyResultModel } from '../../../../domain/usercases/save-survey-result'
import { SaveSurveyResultRepository } from '../../../protocols/db/survey'
import { DbSaveSurveyResult } from './db-save-survey-result'

type SutTypes = {
  sut: SaveSurveyResult
  saveSurveyRepositoryStub: SaveSurveyResultRepository
}

const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (): Promise<SaveSurveyResultModel> {
      return makeSurveyResultModel()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
  const saveSurveyRepositoryStub = makeSaveSurveyResultRepositoryStub()
  const sut = new DbSaveSurveyResult(saveSurveyRepositoryStub)
  return {
    sut,
    saveSurveyRepositoryStub
  }
}

const makeSurveyResultModel = (): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  create_at: new Date()
})

const makeSaveSurveyResultModel = (): SaveSurveyResultModel => (
  {
    surveyId: 'any_id',
    accountId: 'any_account_id',
    answer: 'any_answer',
    create_at: new Date()
  }
)

describe('Save Survey', () => {
  test('Shoud call SaveSurveyResultRepository with correct value', async () => {
    const { sut, saveSurveyRepositoryStub } = makeSut()
    const saveSurveyRepoSpy = jest.spyOn(saveSurveyRepositoryStub, 'save')
    await sut.save(makeSaveSurveyResultModel())
    expect(saveSurveyRepoSpy).toBeCalledWith(makeSaveSurveyResultModel())
  })

  test('Shoud throw if SaveSurveyRepository throws', async () => {
    const { sut, saveSurveyRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyRepositoryStub, 'save')
    await sut.save(makeSaveSurveyResultModel())
    expect(saveSurveyRepoSpy).toBeCalledWith(makeSaveSurveyResultModel())
  })
})
