package xyz.st.meethere.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InOrder;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import xyz.st.meethere.entity.User;
import xyz.st.meethere.exception.FileException;
import xyz.st.meethere.service.UserService;
import xyz.st.meethere.service.FileService;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UserControllerTest {

    private UserService userService;
    private FileService fileService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        userService = mock(UserService.class);
        fileService = mock(FileService.class);
        mockMvc = MockMvcBuilders.standaloneSetup(new UserController(userService, fileService)).build();
    }

//    @Test
//    public void happy_path_when_get_admin_by_name(){
//
//    }
//
//    @Test
//    public void admin_not_exist_when_get_admin_by_name() {
//
//    }

    @Test
    public void happy_path_when_get_user_by_id() throws Exception {
        User user = new User(1, "user1", "123", null, null, null, 100, true);
        when(userService.getUserById(1)).thenReturn(user);
        mockMvc.perform(get("/user/getById")
                .param("userId","1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.responseMap.result").isNotEmpty());
        verify(userService).getUserById(1);
    }

    @Test
    public void user_not_exist_when_get_user_by_id() throws Exception {
        when(userService.getUserById(1)).thenReturn(null);
        mockMvc.perform(get("/user/getById")
                .param("userId","1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(404));
        verify(userService).getUserById(1);
    }

    @Test
    public void happy_path_when_login_user() throws Exception {
        when(userService.checkUserPassword("user", "123")).thenReturn(true);
        mockMvc.perform(get("/user/enter")
                .param("userName","user")
                .param("password","123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200));
        verify(userService).checkUserPassword("user", "123");
    }

    @Test
    public void pwd_wrong_when_login_user() throws Exception {
        when(userService.checkUserPassword("user1", "123")).thenReturn(false);
        mockMvc.perform(get("/user/enter")
                .param("userName","user1")
                .param("password","123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(404));
        verify(userService).checkUserPassword("user1", "123");
    }

    @Test
    public void happy_path_when_update_user_info_by_id() throws Exception {
        User user = new User(1, "user1", "123", null, null, null, 100, true);
        when(userService.getUserById(1)).thenReturn(user);
        when(userService.updateUserByModel(user)).thenReturn(200);

        Map<String, Integer> requestParam = new HashMap<>();
        requestParam.put("userId",1);

        ObjectMapper objectMapper = new ObjectMapper();
        ObjectWriter objectWriter = objectMapper.writer().withDefaultPrettyPrinter();
        String requestJson = objectWriter.writeValueAsString(requestParam);

        mockMvc.perform(post("/user/updateById")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.responseMap.user").isNotEmpty());
        InOrder order = inOrder(userService);
        order.verify(userService).getUserById(1);
        order.verify(userService).updateUserByModel(any());
    }

    @Test
    public void no_id_passed_when_update_user_info_by_id() throws Exception {
        Map<String, Integer> requestParam = new HashMap<>();

        ObjectMapper objectMapper = new ObjectMapper();
        ObjectWriter objectWriter = objectMapper.writer().withDefaultPrettyPrinter();
        String requestJson = objectWriter.writeValueAsString(requestParam);

        mockMvc.perform(post("/user/updateById")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(400));
        verifyNoInteractions(userService);
    }

    @Test
    public void user_not_exist_when_update_user_info_by_id() throws Exception {
        when(userService.getUserById(1)).thenReturn(null);

        Map<String, Integer> requestParam = new HashMap<>();
        requestParam.put("userId",1);

        ObjectMapper objectMapper = new ObjectMapper();
        ObjectWriter objectWriter = objectMapper.writer().withDefaultPrettyPrinter();
        String requestJson = objectWriter.writeValueAsString(requestParam);

        mockMvc.perform(post("/user/updateById")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(404));
        verify(userService).getUserById(1);
        verifyNoMoreInteractions(userService);
    }

    @Test
    public void happy_path_when_update_user_profile_pic() throws Exception {
        User user = new User(1, "user1", "123", null, null, null, 100, true);
        when(fileService.storeFile(any())).thenReturn("filename");
        when(userService.updateUserProfilePicByUserId(anyString(),anyInt())).thenReturn(200);
        when(userService.getUserById(1)).thenReturn(user);
        mockMvc.perform(multipart("/user/profilePic")
                .file(new MockMultipartFile("image", "image.png", "image/png", "this is image".getBytes()))
                .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.responseMap.user").exists());
        InOrder order = inOrder(userService, fileService);
        order.verify(fileService).storeFile(any());
        order.verify(userService).updateUserProfilePicByUserId(anyString(), anyInt());
        order.verify(userService).getUserById(1);
    }

    @Test
    public void fail_to_save_file_when_update_user_profile_pic() throws Exception {
        when(fileService.storeFile(any())).thenThrow(new FileException("image save fail!"));
        assertThrows(Exception.class,() -> {
            mockMvc.perform(multipart("/user/profilePic")
                    .file(new MockMultipartFile("image", "image.png", "image/png", "this is image".getBytes()))
                    .param("userId", "1"));
        });
    }

}