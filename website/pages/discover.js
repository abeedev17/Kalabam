import { getPublicGames } from '../models/Game'
import NextImage from 'next/image'
import { useRouter } from 'next/router'
import {
  Box, Button, Flex, Heading, Icon, Menu, MenuButton, MenuList, MenuItem, SimpleGrid, Text
} from '@chakra-ui/react'
import { FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa'
import Layout from '../components/Layout'
import { Link } from '../components/Link'

const Discover = ({ games }) => {
  const router = useRouter()
  const sortBy = router.query.sortBy
  const isAsc = sortBy === 'asc' || !sortBy

  return (
    <Layout title='Discover | Kalabam' bg='gray.100'>
      <Box py='8' bg='pink.100'>
        <Heading maxW='5xl' mx='auto' color='pink.800'>Discover Games</Heading>
      </Box>
      <Box maxW='5xl' mx='auto'>
        <Flex my='6' justify='flex-end' align='center'>
          <Text mr='2'>{games.length} games sorted by</Text>
          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton
                  isActive={isOpen}
                  as={Button}
                  colorScheme='yellow'
                  size='sm'
                  rightIcon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
                >
                  {isAsc ? 'Newest' : 'Oldest'}
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => router.replace({ pathname: '/discover', query: { sortBy: 'asc' } })}
                  >
                    Newest {isAsc && <Icon ml='2' color='teal.400' as={FaCheck} />}
                  </MenuItem>
                  <MenuItem
                    onClick={() => router.replace({ pathname: '/discover', query: { sortBy: 'desc' } })}
                  >
                    Oldest {!isAsc && <Icon ml='2' color='teal.400' as={FaCheck} />}
                  </MenuItem>
                </MenuList>
              </>
            )}
          </Menu>
        </Flex>
        <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing={8}>
          {games.map((g) => (
            <Link
              key={g._id}
              bg='white'
              href={`/games/${g._id}`}
              borderWidth='thin'
              borderColor='purple.200'
              textDecoration='none !important'
              rounded='sm'
              boxShadow='lg'
              _hover={{ transform: 'scale(1.03)' }}
              _focus={{ boxShadow: 'purple' }}
              isExternal
            >
              <NextImage src={g.image || '/images/game.png'} height={200} width={200} alt={g.title} />
              <Text fontSize='lg' p='3'>{g.title}</Text>
            </Link>
          ))}
        </SimpleGrid>
      </Box>
    </Layout>
  )
}

export async function getServerSideProps (context) {
  const sortBy = context.query.sortBy === 'desc' ? 1 : -1

  return {
    props: {
      games: JSON.parse(
        JSON.stringify(await getPublicGames(sortBy))
      )
    }
  }
}

export default Discover