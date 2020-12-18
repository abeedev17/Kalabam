import { useState, useEffect } from 'react'
import { useEvent } from '@harelpls/use-pusher'
import { Box, Button, Circle, Flex, Text, SimpleGrid, Spacer } from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { useCountDown } from '../../lib/hooks'
import { useLobbyContext } from '../../contexts/Lobby/LobbyContext'
import Answer from './Answer'

const QuestionBlock = ({ question, questionCount }) => {
  const { presenceChannel, trigger, questionIndex, setQuestionIndex } = useLobbyContext()
  const count = useCountDown(question.timeLimit)
  const [answers, setAnswers] = useState([])

  useEffect(() => {
    trigger('client-question', {
      data: {
        timeLimit: question.timeLimit,
        answersCount: question.answers.length
      }
    })
  }, [question])

  useEvent(presenceChannel.channel, 'client-answer', (data, metadata) =>
    setAnswers((a) => [...a, { id: metadata.user_id, answer: data }])
  )

  const handleSkipClick = () => {
    if (questionIndex < questionCount - 1) setQuestionIndex(questionIndex + 1)
  }

  const handleNextClick = () => {
    if (questionIndex < questionCount - 1) setQuestionIndex(questionIndex + 1)
  }

  return (
    <Flex direction='column' h='100vh'>
      <Text
        py='4'
        fontSize='5xl'
        align='center'
        bg='white'
        borderBottomColor='gray.200'
        borderBottomWidth='thick'
      >
        {question.question}
      </Text>
      <Box flex={1} px='12' bg='lightPink'>
        <Flex my='20'>
          <Circle bg='teal.100' w='10%'>
            <Text fontSize='3xl'>{count}</Text>
          </Circle>
          <Spacer />
          {count === 0
            ? (
              <Button
                aria-label='Next'
                colorScheme='blue'
                onClick={handleNextClick}
                rightIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
              )
            : (
              <Button aria-label='Skip' colorScheme='blue' onClick={handleSkipClick}>
                Skip
              </Button>
              )}
        </Flex>
        <SimpleGrid columns={[1, 1, 2]} spacing={4}>
          {question.answers.map(({ id, answer, color }) => <Answer key={id} answer={answer} color={color} />)}
        </SimpleGrid>
      </Box>
      <Flex py='4' px='12'>
        <Text fontSize='xl'>{`${questionIndex + 1} of ${questionCount}`}</Text>
        <Spacer />
        <Text fontSize='xl'>{`${answers.length} answered`}</Text>
        <Spacer />
        <Text fontSize='xl' fontWeight='bold' color='blue.800'>Kalabam</Text>
      </Flex>
    </Flex>
  )
}

export default QuestionBlock