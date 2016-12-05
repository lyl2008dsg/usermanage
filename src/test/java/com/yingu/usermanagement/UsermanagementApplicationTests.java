package com.yingu.usermanagement;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.TestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UsermanagementApplicationTests {

	@Test
	public void contextLoads() {
	}

	@Test
	public void testJspWithEl() throws Exception {
		ResponseEntity<String> entity = new TestRestTemplate().getForEntity("https://jack:5443", String.class);
		assertEquals(HttpStatus.OK, entity.getStatusCode());
		assertTrue("Wrong body:\n" + entity.getBody(), entity.getBody().contains("http://blog.didispace.com"));
	}
}
